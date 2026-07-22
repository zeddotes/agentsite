export {
  buildSitemapPayload,
  createAgentsMdHandler,
  createLlmsTxtHandler,
  createSkillMdHandler,
  generateLlmsTxt,
  jsonTwinResponse,
  wantsJsonTwin,
} from "./json-twin";
export { buildJsonTwinPayload } from "agentsite/payload";
export type {
  LlmsTxtOptions,
  SitemapIndexPayload,
  SkillMdOptions,
} from "./json-twin";

import { buildJsonTwinPayload } from "agentsite/payload";
import type { NextRequest } from "next/server";
import { jsonTwinResponse, wantsJsonTwin } from "./json-twin";

export function maybeJsonTwin(
  request: NextRequest | Request,
  payload: Parameters<typeof buildJsonTwinPayload>[0],
): Response | null {
  if (!wantsJsonTwin(request)) return null;
  return jsonTwinResponse(buildJsonTwinPayload(payload));
}
