import type { ReactNode } from "react";
import { AgentSiteProvider } from "./context";
import { AGENT_PROTOCOL_SUMMARY } from "./agentProtocol";
import type { AgentSiteProps } from "./types";

const DEFAULT_HUMAN_MESSAGE =
  "This site is used through an AI agent — not by browsing it yourself. Tell your agent to open this URL. It should show you a sitemap menu in chat and navigate from your choices.";

const DEFAULT_HUMAN_HINT = `Agents: ${AGENT_PROTOCOL_SUMMARY}`;

/**
 * Root provider for an Agentsite app.
 */
export function AgentSite({
  name,
  contentVisible = false,
  humanMessage = DEFAULT_HUMAN_MESSAGE,
  humanHint = DEFAULT_HUMAN_HINT,
  baseUrl,
  initialRoutes,
  initialSkills,
  children,
}: AgentSiteProps): ReactNode {
  return (
    <AgentSiteProvider
      name={name}
      contentVisible={contentVisible}
      humanMessage={humanMessage}
      humanHint={humanHint}
      baseUrl={baseUrl}
      initialRoutes={initialRoutes}
      initialSkills={initialSkills}
    >
      <div
        className="agentsite-site"
        data-agentsite-site={name}
        data-content-visible={contentVisible ? "true" : "false"}
        data-agentsite-protocol="interactive-nav"
      >
        {children}
      </div>
    </AgentSiteProvider>
  );
}
