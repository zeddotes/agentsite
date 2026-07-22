"use client";

import {
  AgentSite,
  type AgentSiteProps,
  type DeclaredSkill,
  type SitemapRoute,
} from "agentsite";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type NextAgentSiteContextValue = {
  routes: SitemapRoute[];
  baseUrl: string;
};

const NextAgentSiteContext = createContext<NextAgentSiteContextValue | null>(
  null,
);

export function useNextAgentSite(): NextAgentSiteContextValue {
  const ctx = useContext(NextAgentSiteContext);
  if (!ctx) {
    throw new Error("useNextAgentSite must be used within <NextAgentSite>.");
  }
  return ctx;
}

export type NextAgentSiteProps = AgentSiteProps & {
  baseUrl?: string;
  routes?: SitemapRoute[];
  skills?: DeclaredSkill[];
  children?: ReactNode;
};

/**
 * Next-oriented AgentSite wrapper.
 * Seeds routes/skills into the provider for correct SSR JSON twin embeds.
 */
export function NextAgentSite({
  baseUrl = "",
  routes = [],
  skills = [],
  children,
  ...siteProps
}: NextAgentSiteProps): ReactNode {
  const value = useMemo(
    () => ({ routes, baseUrl }),
    [routes, baseUrl],
  );

  return (
    <NextAgentSiteContext.Provider value={value}>
      <AgentSite
        {...siteProps}
        baseUrl={baseUrl || undefined}
        initialRoutes={routes}
        initialSkills={skills}
      >
        {children}
      </AgentSite>
    </NextAgentSiteContext.Provider>
  );
}
