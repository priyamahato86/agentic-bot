import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db, AgentConfig } from "@/db";

const MAX_NAME_LENGTH = 255;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_INSTRUCTIONS_LENGTH = 2000;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const email = (await getServerSession(authOptions))?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number((await params).agentId);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid agent id" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, description, agentImage, instructions } = (body ?? {}) as Record<
      string,
      unknown
    >;

    if (typeof name !== "string" || !name.trim() || name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Agent name is required (max ${MAX_NAME_LENGTH} characters)` },
        { status: 400 }
      );
    }
    if (typeof description !== "string" || description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (typeof instructions !== "string" || instructions.length > MAX_INSTRUCTIONS_LENGTH) {
      return NextResponse.json(
        { error: `Instructions must be at most ${MAX_INSTRUCTIONS_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (typeof agentImage !== "string") {
      return NextResponse.json({ error: "Agent image must be a string" }, { status: 400 });
    }

    const [agent] = await db
      .update(AgentConfig)
      .set({
        name: name.trim(),
        description: description.trim(),
        agentImage,
        instructions: instructions.trim(),
      })
      .where(and(eq(AgentConfig.id, id), eq(AgentConfig.userEmail, email)))
      .returning();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ agent });
  } catch (error) {
    console.error("Failed to update agent:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
