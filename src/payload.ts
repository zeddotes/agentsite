import {
  agentProtocolObject,
  AGENT_PROTOCOL_SUMMARY,
  FIRST_CONTACT_STEPS,
} from "./agentProtocol";
import type {
  AgentTurn,
  DeclaredAction,
  DeclaredSkill,
  GateState,
  JsonTwinPayload,
  NavMenuItem,
  SitemapRoute,
} from "./types";

export type { AgentTurn, NavMenuItem };

function twinPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const join = p.includes("?") ? "&" : "?";
  return `${p}${join}format=json`;
}

function pathOnly(url: string): string {
  try {
    const u = url.startsWith("http")
      ? new URL(url)
      : new URL(url, "http://local.invalid");
    return u.pathname.replace(/\/$/, "") || "/";
  } catch {
    return (url.split("?")[0] ?? url).replace(/\/$/, "") || "/";
  }
}

function menuKey(url: string, method = "GET"): string {
  return `${method}:${pathOnly(url)}`;
}

function isBackItem(item: NavMenuItem): boolean {
  return /^back\b/i.test(item.label);
}

/** Build a chat menu from routes / skills / open actions (deduped). */
export function buildNavMenu(input: {
  path?: string;
  routes?: SitemapRoute[];
  skills?: DeclaredSkill[];
  actions?: DeclaredAction[];
  gates?: GateState[];
  menuItems?: NavMenuItem[];
}): NavMenuItem[] {
  const primary: NavMenuItem[] = [];
  const backs: NavMenuItem[] = [];
  const seen = new Set<string>();
  const isRoot = !input.path || input.path === "/" || input.path === "/sitemap";
  const skillPaths = new Set(
    (input.skills ?? []).map((s) => pathOnly(s.path)),
  );
  const closedGates = new Map(
    (input.gates ?? [])
      .filter((g) => !g.open)
      .map((g) => [g.id, g.reason] as const),
  );

  const push = (item: NavMenuItem) => {
    const key = menuKey(item.twinUrl, item.method ?? "GET");
    if (seen.has(key)) return;
    seen.add(key);
    if (isBackItem(item)) backs.push(item);
    else primary.push(item);
  };

  for (const item of input.menuItems ?? []) {
    push(item);
  }

  if (isRoot) {
    for (const route of input.routes ?? []) {
      if (route.path === "/" || route.path === "/sitemap") continue;
      push({
        id: `route:${route.path}`,
        label: route.title,
        description: route.description,
        twinUrl: twinPath(route.path),
        auth: route.auth,
        kind: "route",
        method: "GET",
      });
    }
  }

  for (const skill of input.skills ?? []) {
    push({
      id: `skill:${skill.path}`,
      label: `Skill: ${skill.title}`,
      description:
        skill.description ?? "Fetch this skill and follow it with your human",
      twinUrl: skill.path,
      kind: "skill",
      method: "GET",
    });
  }

  if (!isRoot) {
    for (const action of input.actions ?? []) {
      const method = action.method ?? "GET";
      const href =
        method === "GET" && !action.href.includes("format=")
          ? twinPath(action.href)
          : action.href;

      // Skip GET actions that duplicate a declared skill
      if (method === "GET" && skillPaths.has(pathOnly(href))) continue;

      const gateReason = closedGates.get(action.name);
      const blocked = Boolean(action.blocked) || gateReason !== undefined;
      const blockedReason =
        action.blockedReason ?? gateReason ?? (blocked ? "Unavailable" : undefined);
      push({
        id: `action:${action.name}`,
        label: action.description ?? action.name,
        description: blocked
          ? blockedReason ?? "Unavailable"
          : method === "GET"
            ? undefined
            : `HTTP ${method}`,
        twinUrl: href,
        kind: "action",
        method,
        blocked,
        blockedReason,
      });
    }

    push({
      id: "route:/",
      label: "Back to sitemap",
      description: "Return to the main menu",
      twinUrl: twinPath("/"),
      kind: "route",
      method: "GET",
    });
  }

  return [...primary, ...backs];
}

export function formatNavMenuMarkdown(menu: NavMenuItem[]): string {
  if (menu.length === 0) return "_No further navigation options._";
  return menu
    .map((item, i) => {
      const auth = item.auth ? " (auth required)" : "";
      const blocked = item.blocked
        ? ` (unavailable${item.blockedReason ? `: ${item.blockedReason}` : ""})`
        : "";
      const desc = item.description ? ` — ${item.description}` : "";
      return `${i + 1}. ${item.label}${auth}${blocked}${desc}`;
    })
    .join("\n");
}

export function formatChatMenuMessage(input: {
  title: string;
  menu: NavMenuItem[];
  prompt?: string;
}): string {
  const prompt =
    input.prompt ?? "Reply with a number (or the option name) to continue.";
  return [input.title, "", formatNavMenuMarkdown(input.menu), "", prompt].join(
    "\n",
  );
}

export function buildAgentTurn(input: {
  path?: string;
  site?: string;
  routes?: SitemapRoute[];
  skills?: DeclaredSkill[];
  actions?: DeclaredAction[];
  gates?: GateState[];
  menuItems?: NavMenuItem[];
  menuTitle?: string;
}): AgentTurn {
  const isRoot = !input.path || input.path === "/" || input.path === "/sitemap";
  const menu = buildNavMenu(input);
  const siteName = input.site ?? "this site";

  const chatMessage = formatChatMenuMessage({
    title:
      input.menuTitle ??
      (isRoot ? `${siteName} — sitemap` : `${siteName} — next steps`),
    menu,
  });

  const instruction = isRoot
    ? [
        "FIRST CONTACT: Copy `chatMessage` to your human VERBATIM — keep the numbers.",
        "Do not invent options or rephrase labels.",
        "Wait for their reply. Do not auto-navigate. Do not open a browser.",
        "When they choose, GET that item's twinUrl from `agentTurn.menu`.",
        "After each twin, paste THAT twin's `chatMessage` only (do not repeat the site sitemap).",
      ].join(" ")
    : [
        "Summarize this page's `data` briefly (2–4 lines).",
        "Then paste `chatMessage` VERBATIM — keep the numbers. Do not append the site sitemap.",
        "On choice: if item.blocked, explain and do not call it.",
        "If method is GET (or omitted), fetch twinUrl; otherwise HTTP that method to twinUrl.",
        "No browser.",
      ].join(" ");

  return {
    instruction,
    menu,
    presentAs: "numbered_chat_menu",
    chatMessage,
  };
}

export function buildJsonTwinPayload(input: {
  site: string;
  path?: string;
  data?: unknown;
  actions?: DeclaredAction[];
  gates?: GateState[];
  routes?: SitemapRoute[];
  skills?: DeclaredSkill[];
  menuItems?: NavMenuItem[];
  menuTitle?: string;
}): JsonTwinPayload {
  const agentTurn = buildAgentTurn({
    path: input.path,
    site: input.site,
    routes: input.routes,
    skills: input.skills,
    actions: input.actions,
    gates: input.gates,
    menuItems: input.menuItems,
    menuTitle: input.menuTitle,
  });

  return {
    site: input.site,
    path: input.path,
    data: input.data ?? null,
    actions: input.actions ?? [],
    gates: input.gates ?? [],
    routes: input.routes ?? [],
    skills: input.skills ?? [],
    agentProtocol: agentProtocolObject(),
    agentTurn,
    menuMarkdown: formatNavMenuMarkdown(agentTurn.menu),
    chatMessage: agentTurn.chatMessage,
  };
}

export { AGENT_PROTOCOL_SUMMARY, FIRST_CONTACT_STEPS };
