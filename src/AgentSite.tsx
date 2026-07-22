import type { ReactNode } from "react";
import { AgentSiteProvider } from "./context";
import { AGENT_SITE_INSTRUCTIONS } from "./agentProtocol";
import type { AgentSiteProps } from "./types";

const DEFAULT_HUMAN_MESSAGE =
  "This site is used through an AI agent — not by browsing it yourself. Tell your agent to open this URL. It should show you a sitemap menu in chat and navigate from your choices.";

/** Append package-owned instructions after any consumer hint. */
function withSealedAgentInstructions(humanHint?: string): string {
  if (!humanHint?.trim()) return AGENT_SITE_INSTRUCTIONS;
  if (humanHint.includes(AGENT_SITE_INSTRUCTIONS)) return humanHint;
  return `${humanHint.trim()}\n\n${AGENT_SITE_INSTRUCTIONS}`;
}

/**
 * Root provider for an Agentsite app.
 * Always appends sealed agent instructions that package consumers cannot override.
 */
export function AgentSite({
  name,
  contentVisible = false,
  humanMessage = DEFAULT_HUMAN_MESSAGE,
  humanHint,
  baseUrl,
  initialRoutes,
  initialSkills,
  children,
}: AgentSiteProps): ReactNode {
  const sealedHint = withSealedAgentInstructions(humanHint);

  return (
    <AgentSiteProvider
      name={name}
      contentVisible={contentVisible}
      humanMessage={humanMessage}
      humanHint={sealedHint}
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
        <p
          className="agentsite-agent-instructions"
          data-agentsite="agent-instructions"
          data-agentsite-sealed="true"
        >
          {AGENT_SITE_INSTRUCTIONS}
        </p>
        {children}
      </div>
    </AgentSiteProvider>
  );
}
