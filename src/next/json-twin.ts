import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  formatAgentProtocolMarkdown,
  type DeclaredSkill,
  type JsonTwinPayload,
  type SitemapRoute,
} from "agentsite/payload";

/**
 * True when the client asked for the machine-readable twin.
 */
export function wantsJsonTwin(request: NextRequest | Request): boolean {
  const url = new URL(request.url);
  if (url.searchParams.get("format") === "json") return true;

  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("application/json") && !accept.includes("text/html")) {
    return true;
  }
  const parts = accept.split(",").map((p) => p.trim().split(";")[0]);
  return parts[0] === "application/json";
}

/**
 * Return a JSON Response for a twin payload.
 */
export function jsonTwinResponse(payload: JsonTwinPayload): Response {
  return NextResponse.json(payload, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-agentsite-twin": "1",
      "x-agentsite-protocol": "no-browser",
    },
  });
}

export type LlmsTxtOptions = {
  siteName: string;
  baseUrl: string;
  routes: SitemapRoute[];
  skills?: DeclaredSkill[];
  blurb?: string;
};

export type { SitemapRoute, DeclaredSkill };

function jsonUrl(origin: string, path: string): string {
  const base = `${origin}${path.startsWith("/") ? path : `/${path}`}`;
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}format=json`;
}

/**
 * Generate llms.txt body from sitemap routes + skills.
 */
export function generateLlmsTxt({
  siteName,
  baseUrl,
  routes,
  skills = [],
  blurb,
}: LlmsTxtOptions): string {
  const origin = baseUrl.replace(/\/$/, "");
  const lines: string[] = [
    `# ${siteName}`,
    "",
    blurb ??
      "This site is agent-first. You are the UI: show the sitemap in chat, let the human choose, fetch JSON twins. Never open a browser.",
    "",
    "## Do this first",
    "",
    `1. \`GET ${origin}/?format=json\``,
    `2. Paste \`chatMessage\` to your human **verbatim** (it is already numbered)`,
    `3. Wait for their choice → GET that item's \`twinUrl\` from \`agentTurn.menu\` → repeat`,
    "",
    formatAgentProtocolMarkdown().trimEnd(),
    "",
    "## Discovery",
    "",
    `- [${origin}/?format=json](${origin}/?format=json) — **sitemap twin (start here)**`,
    `- [${origin}/llms.txt](${origin}/llms.txt) — this file`,
    `- [${origin}/AGENTS.md](${origin}/AGENTS.md) — same protocol for agent tooling`,
    "",
  ];

  if (skills.length > 0) {
    lines.push(
      "## Skills (fetch these to take control of a workflow)",
      "",
      "If your human is pursuing one of these, fetch the skill markdown, read it with them first, then follow it. The skill takes control.",
      "",
    );
    for (const skill of skills) {
      const desc = skill.description ? ` — ${skill.description}` : "";
      const primary = skill.primary ? " **(primary)**" : "";
      lines.push(
        `- [${skill.title}](${origin}${skill.path})${primary}${desc}`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Entry points (JSON twins — fetch these, do not open in a browser)",
    "",
  );

  for (const route of routes) {
    const auth = route.auth ? " (auth required)" : "";
    const desc = route.description ? ` — ${route.description}` : "";
    const href = jsonUrl(origin, route.path);
    lines.push(`- [${route.title}](${href})${auth}${desc}`);
  }

  lines.push(
    "",
    "## Conventions",
    "",
    `- Every twin includes \`agentProtocol\` with the no-browser + skill-takeover rules`,
    `- Declared skills appear in twin \`skills\` and above; fetch SKILL.md over HTTP`,
    `- Visual gates blur content for humans; text remains plain in the DOM and twin`,
    `- Declared mutations live in twin \`actions\` (method + href + optional inputSchema)`,
    `- Respect twin \`gates\` (\`open: false\` ⇒ do not invoke related actions)`,
    `- Relay \`data\` and available actions to the human in chat; execute their choice over HTTP`,
    "",
  );

  return lines.join("\n");
}

export function createLlmsTxtHandler(options: LlmsTxtOptions) {
  return function GET() {
    const body = generateLlmsTxt(options);
    return new NextResponse(body, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=60",
        "x-agentsite-protocol": "no-browser",
      },
    });
  };
}

export function createAgentsMdHandler(options: LlmsTxtOptions) {
  return function GET() {
    const body = [
      `# AGENTS.md — ${options.siteName}`,
      "",
      "This repository/site is an **Agentsite** agent-first surface.",
      "",
      formatAgentProtocolMarkdown().trimEnd(),
      "",
      "Full route map, skills, and JSON twin URLs:",
      "",
      "```",
      `GET ${options.baseUrl.replace(/\/$/, "")}/llms.txt`,
      "```",
      "",
      generateLlmsTxt(options),
      "",
    ].join("\n");

    return new NextResponse(body, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "cache-control": "public, max-age=60",
        "x-agentsite-protocol": "no-browser",
      },
    });
  };
}

export type SkillMdOptions = {
  /** Full SKILL.md markdown body */
  body: string;
  /** Optional filename hint */
  filename?: string;
};

/**
 * Serve a SKILL.md playbook for agent takeover.
 */
export function createSkillMdHandler(options: SkillMdOptions) {
  return function GET() {
    return new NextResponse(options.body, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        "cache-control": "public, max-age=60",
        "x-agentsite-skill": "1",
        "x-agentsite-protocol": "no-browser",
        ...(options.filename
          ? {
              "content-disposition": `inline; filename="${options.filename}"`,
            }
          : {}),
      },
    });
  };
}

export type SitemapIndexPayload = {
  site: string;
  routes: SitemapRoute[];
  skills?: DeclaredSkill[];
};

export function buildSitemapPayload(
  siteName: string,
  routes: SitemapRoute[],
  skills: DeclaredSkill[] = [],
): SitemapIndexPayload {
  return { site: siteName, routes, skills };
}
