"use client";

import type { ReactNode } from "react";
import { useAgentSite } from "./context";
import type { AgentPageProps } from "./types";

/**
 * Page shell: agent structure is always in the DOM.
 * Visually collapses to interstitial-friendly layout unless contentVisible.
 */
export function AgentPage({
  path,
  title,
  description,
  children,
  className,
}: AgentPageProps): ReactNode {
  const site = useAgentSite();

  return (
    <main
      className={["agentsite-page", className].filter(Boolean).join(" ")}
      data-agentsite="page"
      data-agentsite-path={path}
      data-content-visible={site.contentVisible ? "true" : "false"}
    >
      {(title || description) && (
        <header className="agentsite-page__header" data-agentsite="page-header">
          {title ? <h1 className="agentsite-page__title">{title}</h1> : null}
          {description ? (
            <p className="agentsite-page__description">{description}</p>
          ) : null}
        </header>
      )}
      <div className="agentsite-page__body" data-agentsite="page-body">
        {children}
      </div>
    </main>
  );
}
