import { eq } from "drizzle-orm";
import { db, AgentConfig, type Agent } from "@/db";
import { composio } from "./composio";

export type AgentSession = Awaited<ReturnType<typeof composio.sessions.create>>;

export const getAgentToolSlugs = (agent: Pick<Agent, "tools">): string[] =>
  Array.isArray(agent.tools)
    ? agent.tools.filter((t): t is string => typeof t === "string" && t.length > 0)
    : [];

/**
 * Returns a Composio tool-router session for the agent, or null when the agent
 * has no tools enabled. The session is scoped to the user (so their own connected
 * accounts are used) and its id is cached on the agent row. Callers must clear
 * `composioSessionId` whenever `tools` changes.
 */
export async function getOrCreateAgentSession(
  agent: Agent,
  userEmail: string
): Promise<AgentSession | null> {
  const toolkits = getAgentToolSlugs(agent);
  if (toolkits.length === 0) return null;

  if (agent.composioSessionId) {
    try {
      return await composio.sessions.use(agent.composioSessionId);
    } catch {
      console.warn("Composio session expired or invalid, creating a new one");
    }
  }

  // manageConnections lets the model hand the user an auth link
  // when a toolkit isn't connected yet.
  const session = await composio.sessions.create(userEmail, {
    toolkits,
    manageConnections: true,
  });

  await db
    .update(AgentConfig)
    .set({ composioSessionId: session.sessionId })
    .where(eq(AgentConfig.id, agent.id));

  return session;
}
