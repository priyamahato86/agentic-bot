import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db, users } from "@/db";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 200 });
    }

    const [result] = await db
      .insert(users)
      .values({ email, name: session.user?.name })
      .returning();

    return NextResponse.json({ message: "User saved successfully", user: result });
  } catch (error) {
    console.error("Failed to save user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
