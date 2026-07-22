# Changelog

## 0.2.1 — 2026-07-22

### Sealed agent instructions

- `<AgentSite>` always appends package-owned navigation instructions consumers cannot override
- Agents must not use a browser unless the human explicitly asks; default intent is chat-driven navigation
- `AGENT_SITE_INSTRUCTIONS` exported; embedded on JSON twins as `agentProtocol.siteInstructions`

## 0.2.0 — 2026-07-22

### Next.js adapter (same package)

- `agentsite/next` — `NextAgentSite` client wrapper
- `agentsite/next/server` — `wantsJsonTwin`, `createLlmsTxtHandler`, `createAgentsMdHandler`, `createSkillMdHandler`, `buildJsonTwinPayload`, twin helpers
- `next` is an optional peer dependency

## 0.1.0 — 2026-07-21

### Initial release

- React primitives for agent-first sites: `AgentSite`, `AgentPage`, `HumanGate`, `Sitemap`, `Route`, `Action`, `Gate`, `JsonTwin`
- Agent takeover surfaces: `AgentPreamble`, `VisualGate`, `ReverseCaptcha`, `Skill`
- Dual-surface CSS (`contentVisible` / `data-content-visible`)
- Agent protocol on every JSON twin (`agentsite/payload`)
- Interactive chat navigation: `agentTurn` + `menuMarkdown` on twins
