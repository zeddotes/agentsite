# Agentsite

React primitives for **agent-first** websites: dual surface (human interstitial + rich agent structure), declarative sitemaps, actions, gates, and JSON twins.

[![npm version](https://img.shields.io/npm/v/agentsite.svg)](https://www.npmjs.com/package/agentsite)
[![CI](https://github.com/zeddotes/agentsite/actions/workflows/ci.yml/badge.svg)](https://github.com/zeddotes/agentsite/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Features

- Dual surface: humans see an interstitial; agents get full structure in the DOM and optional JSON twin
- Declarative `Sitemap` / `Route`, `Action`, and `Gate` primitives
- JSON twins with baked-in agent protocol (`agentTurn`, `menuMarkdown`)
- Takeover surfaces: `AgentPreamble`, `VisualGate`, `ReverseCaptcha`, `Skill`
- Framework-agnostic React — works with Vite, Next.js, or any React 18+ app

## Install

```bash
npm install agentsite
```

```ts
import {
  AgentSite,
  AgentPage,
  HumanGate,
  Sitemap,
  Route,
  Action,
  Gate,
  JsonTwin,
} from "agentsite";
import "agentsite/styles.css";
```

## Quick start

```tsx
import {
  AgentSite,
  AgentPage,
  HumanGate,
  Sitemap,
  Route,
  JsonTwin,
} from "agentsite";
import "agentsite/styles.css";

export function App() {
  return (
    <AgentSite name="Demo" baseUrl="https://example.com">
      <HumanGate />
      <AgentPage path="/" title="Home">
        <Sitemap>
          <Route path="/" title="Home" description="Start here" />
          <Route path="/about" title="About" />
        </Sitemap>
        <JsonTwin data={{ hello: "world" }} path="/" />
      </AgentPage>
    </AgentSite>
  );
}
```

See a runnable Vite app in [`examples/basic`](./examples/basic).

## Agent protocol (no browser)

Agentsite sites are meant to be **fetched**, not browsed:

1. Agent reads `/llms.txt` or `/AGENTS.md` (you serve these)
2. If a **skill** is listed, fetch that `SKILL.md`, read with the human, then follow it
3. Follow entry URLs with `?format=json`
4. Relay twin `data` / `actions` / `gates` / `skills` in chat
5. Execute chosen actions over HTTP

| Component | Role |
|-----------|------|
| `AgentPreamble` | “If you were sent ahead…” + skill href |
| `VisualGate` | Locked chrome + blurred body for humans; plain for agents |
| `ReverseCaptcha` | “I'm not a human” |
| `Skill` | Registers a fetchable playbook |

Every JSON twin includes `agentProtocol`. Do not open a browser for the human.

## Dual surface

- Agents always receive full structure in the DOM (and optional JSON twin).
- Humans see `HumanGate` copy unless `contentVisible` is true (e.g. for admin/dev).

## Primitives

| Component | Role |
|-----------|------|
| `AgentSite` | Root provider |
| `AgentPage` | Page shell |
| `HumanGate` | Human interstitial |
| `Sitemap` / `Route` | Navigable index |
| `JsonTwin` | Embed machine payload (`#agentsite-json-twin`) |
| `Action` | Declared GET/POST affordance |
| `Gate` | Process gate around actions |

## JSON twin helper (no React)

Server-safe payload builder:

```ts
import { buildJsonTwinPayload } from "agentsite/payload";

const twin = buildJsonTwinPayload({
  site: "Demo",
  path: "/",
  data: { hello: "world" },
  routes: [{ path: "/", title: "Home" }],
});
```

## Next.js App Router

`next` is an optional peer dependency. Subpath exports:

```ts
import { NextAgentSite } from "agentsite/next";
import {
  wantsJsonTwin,
  createLlmsTxtHandler,
  createAgentsMdHandler,
  createSkillMdHandler,
  buildJsonTwinPayload,
} from "agentsite/next/server";
```

```ts
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { wantsJsonTwin } from "agentsite/next/server";

export function middleware(request: NextRequest) {
  if (!wantsJsonTwin(request)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.searchParams.set("path", url.pathname);
  url.pathname = "/api/twin";
  return NextResponse.rewrite(url);
}
```

```tsx
// app/layout.tsx
import { NextAgentSite } from "agentsite/next";
import "agentsite/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAgentSite name="Demo" baseUrl="https://example.com" routes={[]}>
          {children}
        </NextAgentSite>
      </body>
    </html>
  );
}
```

## Scripts

```bash
npm test          # Vitest
npm run typecheck
npm run build
```

## Contributing

1. Fork and clone
2. `npm install`
3. `npm test && npm run typecheck && npm run build`
4. Open a pull request

## License

MIT © [zeddotes](https://github.com/zeddotes)
