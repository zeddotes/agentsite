import type { ReactNode } from "react";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ActionInputSchema = {
  type: "object";
  properties?: Record<
    string,
    {
      type: string;
      description?: string;
      required?: boolean;
    }
  >;
  required?: string[];
};

export type SitemapRoute = {
  path: string;
  title: string;
  description?: string;
  auth?: boolean;
};

/** Declared agent skill (SKILL.md) — fetchable playbook that takes workflow control. */
export type DeclaredSkill = {
  path: string;
  title: string;
  description?: string;
  /** When true, listed as a primary takeover target in llms.txt */
  primary?: boolean;
};

export type NavMenuItem = {
  id: string;
  label: string;
  description?: string;
  twinUrl: string;
  auth?: boolean;
  kind: "route" | "skill" | "action";
  /** HTTP method for this choice (default GET). Non-GET = invoke action, not fetch a page twin. */
  method?: HttpMethod;
  /** When true, show in menu but do not invoke. */
  blocked?: boolean;
  blockedReason?: string;
};

export type AgentTurn = {
  instruction: string;
  menu: NavMenuItem[];
  presentAs: "numbered_chat_menu";
  /** Exact text to paste to the human (numbered). Prefer this over paraphrasing. */
  chatMessage?: string;
};

export type DeclaredAction = {
  name: string;
  method: HttpMethod;
  href: string;
  description?: string;
  inputSchema?: ActionInputSchema;
  blocked?: boolean;
  blockedReason?: string;
};

export type GateState = {
  id: string;
  open: boolean;
  reason?: string;
};

export type AgentSiteConfig = {
  name: string;
  contentVisible: boolean;
  humanMessage: string;
  humanHint?: string;
  /** Absolute origin for human copy-paste prompts (e.g. https://example.com). */
  baseUrl?: string;
};

export type JsonTwinPayload = {
  site: string;
  path?: string;
  data: unknown;
  actions?: DeclaredAction[];
  gates?: GateState[];
  routes?: SitemapRoute[];
  skills?: DeclaredSkill[];
  /** Always present: how agents must navigate (no browser). */
  agentProtocol?: ReturnType<
    typeof import("./agentProtocol").agentProtocolObject
  >;
  /** What the agent must say/do next in chat (interactive nav). */
  agentTurn?: AgentTurn;
  /** Ready-to-paste numbered menu for the human. */
  menuMarkdown?: string;
  /** Full chat block (title + numbered menu + prompt). Prefer pasting this verbatim. */
  chatMessage?: string;
};

export type AgentSiteContextValue = AgentSiteConfig & {
  routes: SitemapRoute[];
  registerRoute: (route: SitemapRoute) => void;
  actions: DeclaredAction[];
  registerAction: (action: DeclaredAction) => void;
  gates: GateState[];
  registerGate: (gate: GateState) => void;
  skills: DeclaredSkill[];
  registerSkill: (skill: DeclaredSkill) => void;
  twinData: unknown | null;
  setTwinData: (data: unknown) => void;
};

export type AgentPageProps = {
  path?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export type HumanGateProps = {
  message?: string;
  hint?: string;
  className?: string;
};

export type ActionProps = {
  name: string;
  method?: HttpMethod;
  href: string;
  description?: string;
  inputSchema?: ActionInputSchema;
  children?: ReactNode;
  className?: string;
};

export type GateProps = {
  id: string;
  blockedUnless: boolean;
  reason?: string;
  children?: ReactNode;
  className?: string;
};

export type JsonTwinProps = {
  data: unknown;
  /** When true, also embed a <script type="application/json"> for DOM agents */
  embed?: boolean;
  /** Page path for agentTurn (root vs nested menu rules). */
  path?: string;
  menuTitle?: string;
  /** Explicit menu items for SSR-accurate embeds (match HTTP twin). */
  menuItems?: NavMenuItem[];
  /** Explicit actions for SSR embeds (before <Action> effects run). */
  actions?: DeclaredAction[];
  /** Explicit gates for SSR embeds (before <Gate> effects run). */
  gates?: GateState[];
};

export type RouteProps = {
  path: string;
  title: string;
  description?: string;
  auth?: boolean;
};

export type SitemapProps = {
  children?: ReactNode;
  /** Render a navigable index list (default true when used as page content) */
  renderIndex?: boolean;
  className?: string;
};

export type AgentSiteProps = {
  name: string;
  contentVisible?: boolean;
  humanMessage?: string;
  humanHint?: string;
  /** Absolute site origin for human agent prompts. */
  baseUrl?: string;
  /** Seed sitemap routes for SSR twin embeds (before <Route> effects run). */
  initialRoutes?: SitemapRoute[];
  /** Seed skills for SSR twin embeds (before <Skill> effects run). */
  initialSkills?: DeclaredSkill[];
  children?: ReactNode;
};

export type AgentPreambleProps = {
  /** Absolute or site-relative skill URL agents must fetch next */
  skillHref?: string;
  children?: ReactNode;
  className?: string;
};

export type VisualGateProps = {
  lockedTitle?: string;
  lockedSubtitle?: string;
  children?: ReactNode;
  className?: string;
};

export type ReverseCaptchaProps = {
  label?: string;
  hint?: string;
  className?: string;
};

export type SkillProps = {
  path: string;
  title: string;
  description?: string;
  primary?: boolean;
};
