import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Action,
  AgentPage,
  AgentSite,
  HumanGate,
  JsonTwin,
} from "../src/index";

describe("component smoke", () => {
  it("renders AgentSite + HumanGate interstitial", () => {
    render(
      <AgentSite name="Demo" baseUrl="https://example.com" contentVisible>
        <HumanGate message="Agents only" />
      </AgentSite>,
    );
    expect(screen.getByLabelText("Human instructions")).toBeInTheDocument();
    expect(screen.getByText("Agents only")).toBeInTheDocument();
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(document.querySelector(".agentsite-site")).toHaveAttribute(
      "data-agentsite-site",
      "Demo",
    );
  });

  it("embeds JsonTwin script with payload", () => {
    render(
      <AgentSite name="Demo" contentVisible>
        <AgentPage path="/" title="Home">
          <JsonTwin data={{ ok: true }} path="/" />
        </AgentPage>
      </AgentSite>,
    );
    const el = document.getElementById("agentsite-json-twin");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("data-agentsite")).toBe("json-twin");
    const payload = JSON.parse(el!.textContent || "{}");
    expect(payload.site).toBe("Demo");
    expect(payload.data).toEqual({ ok: true });
    expect(payload.agentProtocol.navigation.noBrowser).toBe(true);
  });

  it("renders Action as a GET link", () => {
    render(
      <AgentSite name="Demo" contentVisible>
        <Action name="open" href="/open" description="Open thing">
          Open
        </Action>
      </AgentSite>,
    );
    const link = screen.getByRole("link", { name: "Open" });
    expect(link).toHaveAttribute("href", "/open");
    expect(link).toHaveAttribute("data-agentsite-action", "open");
  });
});
