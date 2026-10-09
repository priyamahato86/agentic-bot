import Anthropic from "@anthropic-ai/sdk";
import { anthropicProvider } from "@/lib/composio/composio";
import type { AgentSession } from "@/lib/composio/service";

export type Message = {
    role: "user" | "agent" | "assistant";
    content: string;
};

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOOL_ROUNDS = 8;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const executeAgentChat = async (
    name: string,
    instructions: string,
    messages: Message[],
    session?: AgentSession | null
) => {
    const history: Anthropic.MessageParam[] = messages.map((msg) => ({
        role: msg.role === "assistant" || msg.role === "agent" ? ("assistant" as const) : ("user" as const),
        content: msg.content,
    }));

    const tools = session ? ((await session.tools()) as Anthropic.Tool[]) : [];

    for (let round = 0; ; round++) {
        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 2048,
            system: `You are ${name}. ${instructions}`,
            messages: history,
            ...(tools.length > 0 && { tools }),
        });

        const wantsTools = response.stop_reason === "tool_use" && session;
        if (!wantsTools || round >= MAX_TOOL_ROUNDS) {
            return response.content
                .map((block) => (block.type === "text" ? block.text : ""))
                .join("");
        }

        // Run every requested tool through Composio and feed the results back.
        history.push({ role: "assistant", content: response.content });
        history.push(
            ...((await anthropicProvider.handleToolCalls(
                session,
                response
            )) as Anthropic.MessageParam[])
        );
    }
};
