import { describe, expect, it } from "vitest";
import {
  agentProtocolObject,
  AGENT_PROTOCOL_VERSION,
  formatAgentProtocolMarkdown,
} from "../src/agentProtocol";
import {
  buildJsonTwinPayload,
  buildNavMenu,
  formatNavMenuMarkdown,
} from "../src/payload";

describe("agentProtocol", () => {
  it("exposes version 3 protocol object with noBrowser", () => {
    const protocol = agentProtocolObject();
    expect(protocol.version).toBe(AGENT_PROTOCOL_VERSION);
    expect(protocol.navigation.noBrowser).toBe(true);
    expect(protocol.firstContact.length).toBeGreaterThan(0);
    expect(protocol.rules.length).toBeGreaterThan(0);
  });

  it("formats markdown with first contact steps", () => {
    const md = formatAgentProtocolMarkdown();
    expect(md).toContain("## First contact");
    expect(md).toContain("Do not open a browser");
  });
});

describe("buildNavMenu / buildJsonTwinPayload", () => {
  const routes = [
    { path: "/", title: "Home", description: "Start here" },
    { path: "/about", title: "About" },
  ];

  it("builds root menu from non-root routes", () => {
    const menu = buildNavMenu({ path: "/", routes });
    // Root path itself is omitted from the sitemap menu
    expect(menu.some((item) => item.label === "Home")).toBe(false);
    expect(menu.some((item) => item.label === "About")).toBe(true);
    expect(menu.some((item) => item.twinUrl.includes("format=json"))).toBe(
      true,
    );
  });

  it("marks gated actions as blocked", () => {
    const menu = buildNavMenu({
      path: "/page",
      actions: [
        {
          name: "apply",
          method: "POST",
          href: "/api/apply",
          description: "Apply",
        },
      ],
      gates: [{ id: "apply", open: false, reason: "Not ready" }],
    });
    const apply = menu.find((item) => item.id === "action:apply");
    expect(apply?.blocked).toBe(true);
    expect(apply?.blockedReason).toBe("Not ready");
  });

  it("formats numbered menu markdown", () => {
    const md = formatNavMenuMarkdown([
      {
        id: "route:/",
        label: "Home",
        twinUrl: "/?format=json",
        kind: "route",
      },
    ]);
    expect(md).toBe("1. Home");
  });

  it("builds a twin payload with agentTurn and protocol", () => {
    const twin = buildJsonTwinPayload({
      site: "Demo",
      path: "/",
      data: { hello: "world" },
      routes,
    });
    expect(twin.site).toBe("Demo");
    expect(twin.data).toEqual({ hello: "world" });
    expect(twin.agentProtocol?.version).toBe("3");
    expect(twin.agentTurn?.presentAs).toBe("numbered_chat_menu");
    expect(twin.menuMarkdown).toContain("1.");
    expect(twin.chatMessage).toContain("Demo — sitemap");
  });
});
