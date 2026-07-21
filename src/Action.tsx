"use client";

import { useEffect, type ReactNode } from "react";
import { useAgentSite } from "./context";
import type { ActionProps } from "./types";

/**
 * Declared mutation/navigation affordance for agents.
 * Renders an inspectable link/form affordance and registers in site context.
 */
export function Action({
  name,
  method = "GET",
  href,
  description,
  inputSchema,
  children,
  className,
}: ActionProps): ReactNode {
  const site = useAgentSite();

  const registerAction = site.registerAction;
  useEffect(() => {
    registerAction({
      name,
      method,
      href,
      description,
      inputSchema,
    });
  }, [registerAction, name, method, href, description, inputSchema]);

  const label = children ?? name;

  if (method === "GET") {
    return (
      <a
        className={["agentsite-action", className].filter(Boolean).join(" ")}
        data-agentsite="action"
        data-agentsite-action={name}
        data-method={method}
        href={href}
        title={description}
      >
        {label}
      </a>
    );
  }

  return (
    <form
      className={["agentsite-action", "agentsite-action--form", className]
        .filter(Boolean)
        .join(" ")}
      data-agentsite="action"
      data-agentsite-action={name}
      data-method={method}
      action={href}
      method={method === "DELETE" ? "POST" : method}
      title={description}
    >
      {method === "DELETE" ? (
        <input type="hidden" name="_method" value="DELETE" />
      ) : null}
      {inputSchema?.properties
        ? Object.entries(inputSchema.properties).map(([key, schema]) => (
            <label key={key} className="agentsite-action__field">
              <span>{key}</span>
              <input
                name={key}
                type={schema.type === "number" ? "number" : "text"}
                required={
                  schema.required || inputSchema.required?.includes(key)
                }
                aria-description={schema.description}
              />
            </label>
          ))
        : null}
      <button type="submit">{label}</button>
    </form>
  );
}
