import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db, AgentConfig } from "@/db";
import { getOrCreateAgentSession } from "@/lib/composio/service";
import { executeAgentChat, type Message } from "@/lib/openai/openai-agent";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { agentId, messages } = (body ?? {}) as { agentId?: unknown; messages?: unknown };
    const id = Number(agentId);

    if (!agentId || !Number.isInteger(id) || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing agentId or messages" }, { status: 400 });
    }

    const validMessages = messages.every(
      (m) =>
        m &&
        typeof m.content === "string" &&
        ["user", "agent", "assistant"].includes(m.role)
    );
    if (!validMessages) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Only fetch agents owned by the current user
    const [agent] = await db
      .select()
      .from(AgentConfig)
      .where(and(eq(AgentConfig.id, id), eq(AgentConfig.userEmail, email)))
      .limit(1);

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const composioSession = await getOrCreateAgentSession(agent, email);

    const reply = await executeAgentChat(
      agent.name,
      agent.instructions || "You are a helpful assistant.",
      messages as Message[],
      composioSession
    );

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Failed to chat with agent:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
