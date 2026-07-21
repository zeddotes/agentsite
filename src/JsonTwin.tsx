"use client";

import { useEffect, type ReactNode } from "react";
import { useAgentSite } from "./context";
import {
  buildAgentTurn,
  formatNavMenuMarkdown,
} from "./payload";
import { agentProtocolObject } from "./agentProtocol";
import type { JsonTwinProps } from "./types";

/**
 * Embeds a JSON twin for DOM agents. Prefer HTTP ?format=json for navigation.
 * Uses seeded site routes/skills (and optional explicit menu/actions) so SSR embeds are accurate.
 */
export function JsonTwin({
  data,
  embed = true,
  path,
  menuTitle,
  menuItems,
  actions: actionsProp,
  gates: gatesProp,
}: JsonTwinProps): ReactNode {
  const site = useAgentSite();

  const setTwinData = site.setTwinData;
  useEffect(() => {
    setTwinData(data);
  }, [setTwinData, data]);

  if (!embed) return null;

  const actions = actionsProp ?? site.actions;
  const gates = gatesProp ?? site.gates;

  const agentTurn = buildAgentTurn({
    path,
    site: site.name,
    routes: site.routes,
    skills: site.skills,
    actions,
    gates,
    menuItems,
    menuTitle,
  });

  const payload = {
    site: site.name,
    path,
    data,
    actions,
    gates,
    routes: site.routes,
    skills: site.skills,
    agentProtocol: agentProtocolObject(),
    agentTurn,
    menuMarkdown: formatNavMenuMarkdown(agentTurn.menu),
    chatMessage: agentTurn.chatMessage,
  };

  return (
    <script
      type="application/json"
      id="agentsite-json-twin"
      data-agentsite="json-twin"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
