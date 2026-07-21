"use client";

import { useEffect, type ReactNode } from "react";
import { useAgentSite } from "./context";
import type { RouteProps } from "./types";

/**
 * Declares a navigable route in the site sitemap.
 * Render null; parent <Sitemap> collects routes for the index.
 */
export function Route({
  path,
  title,
  description,
  auth = false,
}: RouteProps): ReactNode {
  const site = useAgentSite();

  const registerRoute = site.registerRoute;
  useEffect(() => {
    registerRoute({ path, title, description, auth });
  }, [registerRoute, path, title, description, auth]);

  return null;
}
