import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db, AgentConfig } from "@/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/workspace/page-header";

export default async function AgentPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const id = Number(agentId);
  const email = (await getServerSession(authOptions))?.user?.email;

  if (!email || !Number.isInteger(id)) notFound();

  const [agent] = await db
    .select()
    .from(AgentConfig)
    .where(and(eq(AgentConfig.id, id), eq(AgentConfig.userEmail, email)));

  if (!agent) notFound();

  return (
    <>
      <PageHeader title={agent.name} />
      <main className="flex items-start gap-4 p-6">
        <Avatar className="size-16 border shadow-sm">
          <AvatarImage src={agent.agentImage ?? undefined} alt={agent.name} />
          <AvatarFallback>{agent.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{agent.name}</h2>
          {agent.description && (
            <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
          )}
        </div>
      </main>
    </>
  );
}
