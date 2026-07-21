import {
  Action,
  AgentPage,
  AgentSite,
  HumanGate,
  JsonTwin,
  Route,
  Sitemap,
} from "agentsite";

export function App() {
  return (
    <AgentSite
      name="Demo"
      baseUrl="https://example.com"
      contentVisible={
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("visible") === "1"
      }
    >
      <HumanGate />
      <AgentPage path="/" title="Home" description="Agent-first demo site">
        <Sitemap>
          <Route path="/" title="Home" description="Start here" />
          <Route path="/about" title="About" description="What this is" />
        </Sitemap>
        <Action name="ping" href="/api/ping" description="Health check">
          Ping
        </Action>
        <JsonTwin
          path="/"
          data={{
            message: "Hello from the JSON twin",
            tip: "Append ?visible=1 to see the full human UI",
          }}
        />
      </AgentPage>
    </AgentSite>
  );
}
