import { describe, expect, it } from "vitest";
import { wantsJsonTwin } from "../src/next/json-twin";

function req(url: string, accept?: string): Request {
  return new Request(url, {
    headers: accept ? { accept } : undefined,
  });
}

describe("wantsJsonTwin", () => {
  it("detects ?format=json", () => {
    expect(wantsJsonTwin(req("https://example.com/?format=json"))).toBe(true);
  });

  it("detects Accept: application/json", () => {
    expect(
      wantsJsonTwin(req("https://example.com/", "application/json")),
    ).toBe(true);
  });

  it("ignores html navigations", () => {
    expect(
      wantsJsonTwin(
        req("https://example.com/", "text/html,application/json;q=0.9"),
      ),
    ).toBe(false);
  });
});
