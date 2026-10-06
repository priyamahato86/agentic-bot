import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db, AgentConfig } from "@/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AgentConfigPanel } from "@/components/workspace/agent-config-panel";
import { ChatPanel } from "@/components/workspace/chat-panel";
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
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          title={agent.name}
          icon={
            <Avatar className="size-9 shadow-sm border">
              <AvatarImage src={agent.agentImage ?? undefined} alt={agent.name} />
              <AvatarFallback>{agent.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          }
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            Active
          </span>
        </PageHeader>
        <ChatPanel
          key={agent.id}
          agentId={agent.id}
          agentName={agent.name}
          agentImage={agent.agentImage}
          agentDescription={agent.description}
        />
      </div>
      <AgentConfigPanel agent={agent} />
    </div>
  );
}
