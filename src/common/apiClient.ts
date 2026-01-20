/**
 * Unified AI provider client using Vercel AI SDK
 */

import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";

import {
  OPENAI_API_KEY,
  XAI_API_KEY,
  validateProvider,
  type AIProvider,
  type ReasoningEffort,
} from "./providerConfig.js";
import { formatTokenInfo } from "./tokenFormatter.js";
import { buildUserPrompt } from "./promptBuilder.js";

// Model defaults with env overrides
const XAI_MODEL = process.env.XAI_MODEL || "grok-4-1-fast-reasoning";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.2";

// Provider client instances (lazy initialization)
let openaiClient: ReturnType<typeof createOpenAI> | null = null;
let xaiClient: ReturnType<typeof createXai> | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = createOpenAI({ apiKey: OPENAI_API_KEY });
  }
  return openaiClient;
}

function getXaiClient() {
  if (!xaiClient) {
    if (!XAI_API_KEY) {
      throw new Error("XAI_API_KEY environment variable is required");
    }
    xaiClient = createXai({ apiKey: XAI_API_KEY });
  }
  return xaiClient;
}

export interface AICallConfig {
  systemPrompt: string;
  task: string;
  code: string;
  analysisType: "comprehensive" | "advice" | "research" | "review";
  reasoningEffort: ReasoningEffort;
  provider: AIProvider;
}

const providers = {
  xai: {
    model: () => getXaiClient()(XAI_MODEL),
    mapOptions: (effort: ReasoningEffort) => ({}), // xAI doesn't support reasoningEffort via Vercel AI SDK yet
  },
  openai: {
    model: () => getOpenAIClient()(OPENAI_MODEL),
    mapOptions: (effort: ReasoningEffort) => ({
      openai: { reasoningEffort: effort },
    }),
  },
} as const;

export async function callAIProvider(config: AICallConfig): Promise<string> {
  validateProvider(config.provider);

  const provider = providers[config.provider];
  if (!provider) {
    throw new Error(`Unsupported provider: ${config.provider}`);
  }

  const userPrompt = buildUserPrompt({
    task: config.task,
    code: config.code,
    analysisType: config.analysisType,
  });

  const result = await generateText({
    model: provider.model(),
    messages: [
      { role: "system", content: config.systemPrompt },
      { role: "user", content: userPrompt },
    ],
    providerOptions: provider.mapOptions(config.reasoningEffort),
  });

  const tokenInfo = formatTokenInfo(
    config.provider,
    result.usage,
    config.reasoningEffort
  );
  return result.text + tokenInfo;
}
