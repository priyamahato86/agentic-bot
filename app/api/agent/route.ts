import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { desc, eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db, AgentConfig } from "@/db";

const MAX_NAME_LENGTH = 255;
const MAX_DESCRIPTION_LENGTH = 200;

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

    const { name, description, agentImage } = (body ?? {}) as Record<string, unknown>;

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Agent name must be at most ${MAX_NAME_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (description !== undefined && description !== null && typeof description !== "string") {
      return NextResponse.json({ error: "Description must be a string" }, { status: 400 });
    }
    if (typeof description === "string" && description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        { error: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (agentImage !== undefined && agentImage !== null && typeof agentImage !== "string") {
      return NextResponse.json({ error: "Agent image must be a string" }, { status: 400 });
    }

    const [agent] = await db
      .insert(AgentConfig)
      .values({
        name: name.trim(),
        description: typeof description === "string" ? description.trim() : null,
        agentImage: typeof agentImage === "string" ? agentImage : null,
        userEmail: email,
      })
      .returning();

    return NextResponse.json({ message: "Agent created successfully", agent }, { status: 201 });
  } catch (error) {
    console.error("Failed to create agent:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agents = await db
      .select()
      .from(AgentConfig)
      .where(eq(AgentConfig.userEmail, email))
      .orderBy(desc(AgentConfig.createdAt));

    return NextResponse.json({ agents });
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
