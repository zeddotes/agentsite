"use client";

import { useEffect, type ReactNode } from "react";
import { useAgentSite } from "./context";
import type { SkillProps } from "./types";

/**
 * Declares a fetchable skill playbook for agents.
 * Registers in site context for JSON twins / llms.txt consumers.
 */
export function Skill({
  path,
  title,
  description,
  primary = false,
}: SkillProps): ReactNode {
  const site = useAgentSite();

  const registerSkill = site.registerSkill;
  useEffect(() => {
    registerSkill({ path, title, description, primary });
  }, [registerSkill, path, title, description, primary]);

  return (
    <link
      rel="agentsite-skill"
      href={path}
      title={title}
      data-agentsite="skill"
      data-primary={primary ? "true" : "false"}
    />
  );
}
