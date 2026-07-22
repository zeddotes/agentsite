/**
 * Canonical Agentsite agent protocol.
 * Baked into llms.txt, AGENTS.md, and every JSON twin so agents do not
 * drive a browser UI for the human — and so declared skills take control.
 */
export const AGENT_PROTOCOL_VERSION = "3";

/**
 * Package-owned instructions always appended by <AgentSite>.
 * Consumers cannot override or remove these via props.
 */
export const AGENT_SITE_INSTRUCTIONS =
  "Do not use a browser to navigate this site unless the human explicitly tells you to. If you have reached this site, the default intent is that the human wants you to navigate it by chatting with them while you act on their behalf — you are the interface, not a page they browse.";

export const AGENT_PROTOCOL_SUMMARY =
  "On first contact: fetch the site JSON twin, spit out the sitemap as a numbered menu in chat, wait for the human's choice, then fetch that twin and repeat. Never open a browser unless the human explicitly asks you to. Skills take over workflows after consent.";

export const FIRST_CONTACT_STEPS: readonly string[] = [
  "Fetch `{origin}/?format=json` (or `/llms.txt` then the sitemap twin). Do not open a browser.",
  "Immediately present the sitemap (and skills, if any) to your human as a clear numbered menu in chat — titles + one-line descriptions.",
  "Ask which option they want. Wait for their reply. Do not auto-navigate.",
  "Fetch the chosen entry's JSON twin (`twinUrl` or path + `?format=json`). Summarize that page in chat.",
  "From that twin, list the next choices (routes, actions that are not blocked, skills) as a new numbered menu. Repeat until they stop.",
  "If they pick a skill: fetch the SKILL.md, read it with them, then follow its phases.",
];

export const AGENT_PROTOCOL_RULES: readonly string[] = [
  "DO NOT open a browser, headless browser, or screenshot/HTML viewer for this site unless the human explicitly tells you to.",
  "DO NOT send the human to the website UI. You are the UI — navigate by chatting and acting on their behalf.",
  "Reaching this site means the human intends chat-driven navigation by default, not self-serve browsing.",
  "Your primary loop is: show menu → human chooses → fetch twin → show menu. That is how the site is used.",
  "Start at `/?format=json` or `/llms.txt`. Prefer JSON twins always.",
  "If a twin names a skill (SKILL.md), offer it as a menu option; on choose, fetch it, read with the human, then execute its phases.",
  "Role/page copy that is blurred for humans is plain in the JSON twin — read the twin, not a browser.",
  "Invoke actions only after the human chooses them; use the declared HTTP method and href.",
  "Respect gates: if open=false or action.blocked, say why and do not call it.",
];

/** Multi-line block for llms.txt / AGENTS.md */
export function formatAgentProtocolMarkdown(): string {
  const lines = [
    "## First contact (do this immediately)",
    "",
    "You were told to navigate this site. You are the interface. Do not open a browser.",
    "",
    ...FIRST_CONTACT_STEPS.map((step, i) => `${i + 1}. ${step}`),
    "",
    "## Agent protocol (required)",
    "",
    AGENT_PROTOCOL_SUMMARY,
    "",
    ...AGENT_PROTOCOL_RULES.map((rule, i) => `${i + 1}. ${rule}`),
    "",
  ];
  return lines.join("\n");
}

/** Structured object embedded on every JSON twin */
export function agentProtocolObject() {
  return {
    version: AGENT_PROTOCOL_VERSION,
    summary: AGENT_PROTOCOL_SUMMARY,
    siteInstructions: AGENT_SITE_INSTRUCTIONS,
    firstContact: [...FIRST_CONTACT_STEPS],
    rules: [...AGENT_PROTOCOL_RULES],
    navigation: {
      discovery: ["/?format=json", "/llms.txt", "/AGENTS.md"],
      twin: "Append ?format=json or send Accept: application/json",
      skills: "Offer as menu options; fetch SKILL.md after human chooses",
      noBrowser: true,
      browserOnlyIfHumanRequests: true,
      chatNavigationDefault: true,
      relayToHuman: true,
      interactiveNav: true,
      visualGateNeverLocked: true,
    },
  };
}
