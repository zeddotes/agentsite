"use client";

import type { ReactNode } from "react";
import { useAgentSite } from "./context";
import type { SitemapProps } from "./types";

/**
 * First-class navigable index. Children are typically <Route> declarations.
 * Renders an agent-oriented link list from registered routes.
 */
export function Sitemap({
  children,
  renderIndex = true,
  className,
}: SitemapProps): ReactNode {
  const site = useAgentSite();

  return (
    <nav
      className={["agentsite-sitemap", className].filter(Boolean).join(" ")}
      data-agentsite="sitemap"
      aria-label={`${site.name} sitemap`}
    >
      {children}
      {renderIndex ? (
        <ul className="agentsite-sitemap__list" data-agentsite="sitemap-list">
          {site.routes.map((route) => (
            <li key={route.path}>
              <a href={route.path} data-agentsite-route={route.path}>
                <strong>{route.title}</strong>
                {route.auth ? (
                  <span className="agentsite-sitemap__auth"> (auth required)</span>
                ) : null}
              </a>
              {route.description ? (
                <p className="agentsite-sitemap__desc">{route.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
