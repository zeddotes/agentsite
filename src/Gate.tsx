"use client";

import { useEffect, type ReactNode } from "react";
import { useAgentSite } from "./context";
import type { GateProps } from "./types";

/**
 * Process enforcement primitive. Wraps actions; exposes blocked state
 * in the DOM and site context for JSON twins.
 */
export function Gate({
  id,
  blockedUnless,
  reason = "Requirements not met",
  children,
  className,
}: GateProps): ReactNode {
  const site = useAgentSite();
  const open = Boolean(blockedUnless);

  const registerGate = site.registerGate;
  useEffect(() => {
    registerGate({
      id,
      open,
      reason: open ? undefined : reason,
    });
  }, [registerGate, id, open, reason]);

  return (
    <section
      className={["agentsite-gate", className].filter(Boolean).join(" ")}
      data-agentsite="gate"
      data-agentsite-gate={id}
      data-open={open ? "true" : "false"}
      aria-disabled={!open}
    >
      {!open ? (
        <p className="agentsite-gate__blocked" data-agentsite="gate-blocked">
          Blocked: {reason}
        </p>
      ) : null}
      <div
        className="agentsite-gate__body"
        data-agentsite="gate-body"
        hidden={!open}
        inert={!open ? true : undefined}
      >
        {children}
      </div>
    </section>
  );
}
