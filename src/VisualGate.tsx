"use client";

import type { ReactNode } from "react";
import { useAgentSite } from "./context";
import type { VisualGateProps } from "./types";

/**
 * Reverse visual gate: humans see a locked chrome + blurred body;
 * agents read the body as plain text in the DOM / JSON twin.
 * The gate was never locked.
 */
export function VisualGate({
  lockedTitle = "Permission denied.",
  lockedSubtitle = "Read access: agents only",
  children,
  className,
}: VisualGateProps): ReactNode {
  const site = useAgentSite();
  const gated = !site.contentVisible;

  return (
    <section
      className={["agentsite-visual-gate", className].filter(Boolean).join(" ")}
      data-agentsite="visual-gate"
      data-agentsite-surface="human"
      data-gated={gated ? "true" : "false"}
    >
      {gated ? (
        <div
          className="agentsite-visual-gate__lock"
          data-agentsite-surface="human"
          aria-hidden="false"
        >
          <h2 className="agentsite-visual-gate__title">{lockedTitle}</h2>
          <p className="agentsite-visual-gate__subtitle">{lockedSubtitle}</p>
        </div>
      ) : null}
      <div
        className="agentsite-visual-gate__body"
        data-agentsite="visual-gate-body"
        data-blurred={gated ? "true" : "false"}
      >
        {children}
      </div>
    </section>
  );
}
