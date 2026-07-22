"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AGENT_SITE_INSTRUCTIONS } from "./agentProtocol";
import { useAgentSite } from "./context";
import type { HumanGateProps } from "./types";

function withSealedAgentInstructions(hint?: string): string {
  if (!hint?.trim()) return AGENT_SITE_INSTRUCTIONS;
  if (hint.includes(AGENT_SITE_INSTRUCTIONS)) return hint;
  return `${hint.trim()}\n\n${AGENT_SITE_INSTRUCTIONS}`;
}

/**
 * Human-visible interstitial. Always rendered; agent content lives beside it.
 */
export function HumanGate({
  message,
  hint,
  className,
}: HumanGateProps): ReactNode {
  const site = useAgentSite();
  const text = message ?? site.humanMessage;
  const sub = withSealedAgentInstructions(hint ?? site.humanHint);
  const origin =
    site.baseUrl?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const startUrl = origin ? `${origin}/?format=json` : "/?format=json";
  const prompt = origin
    ? `Navigate ${site.name} for me at ${origin}. Fetch ${startUrl}, paste chatMessage to me verbatim (keep the numbers), and wait for my choices before making the next request. Do not open a browser.`
    : `Navigate ${site.name}. Start at /?format=json, paste chatMessage to me verbatim, and wait for my choices. Do not open a browser.`;

  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [prompt]);

  return (
    <aside
      className={["agentsite-human-gate", className].filter(Boolean).join(" ")}
      data-agentsite="human-gate"
      aria-label="Human instructions"
    >
      <p className="agentsite-human-gate__message">{text}</p>
      {sub ? <p className="agentsite-human-gate__hint">{sub}</p> : null}
      <p className="agentsite-human-gate__site">
        Site: <strong>{site.name}</strong>
        {origin ? (
          <>
            {" "}
            · <code>{origin}</code>
          </>
        ) : null}
      </p>
      <div className="agentsite-human-gate__prompt">
        <p className="agentsite-human-gate__hint">Paste this to your agent:</p>
        <pre className="agentsite-human-gate__code">{prompt}</pre>
        <button
          type="button"
          className="agentsite-human-gate__copy"
          onClick={copy}
          data-agentsite="copy-agent-prompt"
        >
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
      <p className="agentsite-human-gate__hint">
        Machine entry: <code>/llms.txt</code> · <code>/?format=json</code>
      </p>
    </aside>
  );
}
