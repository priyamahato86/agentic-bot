import { Composio } from "@composio/core";
import { AnthropicProvider } from "@composio/anthropic";

export const anthropicProvider = new AnthropicProvider();

export const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY,
  provider: anthropicProvider,
});
