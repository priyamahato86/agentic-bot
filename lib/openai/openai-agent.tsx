import Anthropic from "@anthropic-ai/sdk";

export type Message = {
    role: "user" | "agent" | "assistant";
    content: string;
};

const MODEL = "claude-haiku-4-5-20251001";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const executeAgentChat = async (
    name: string,
    instructions: string,
    messages: Message[]
) => {
    const history = messages.map((msg) => ({
        role: msg.role === "assistant" || msg.role === "agent" ? ("assistant" as const) : ("user" as const),
        content: msg.content,
    }));

    const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: `You are ${name}. ${instructions}`,
        messages: history,
    });

    return response.content
        .map((block) => (block.type === "text" ? block.text : ""))
        .join("");
};
