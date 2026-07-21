"use client";

import { useState, type ReactNode } from "react";
import type { ReverseCaptchaProps } from "./types";

/**
 * Reverse Turing check: automation / agents can pass; casual human hands struggle.
 * Does not gate content — signals intended operator and records agent attestation.
 */
export function ReverseCaptcha({
  label = "I'm not a human",
  hint = "Reverse CAPTCHA — agents · forgive us",
  className,
}: ReverseCaptchaProps): ReactNode {
  const [checked, setChecked] = useState(false);

  return (
    <label
      className={["agentsite-reverse-captcha", className]
        .filter(Boolean)
        .join(" ")}
      data-agentsite="reverse-captcha"
      data-agentsite-surface="human"
      data-passed={checked ? "true" : "false"}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        data-agentsite-action="attest_agent"
        name="agentsite_agent_attestation"
        value="not_a_human"
      />
      <span className="agentsite-reverse-captcha__label">{label}</span>
      <span className="agentsite-reverse-captcha__hint">{hint}</span>
    </label>
  );
}
