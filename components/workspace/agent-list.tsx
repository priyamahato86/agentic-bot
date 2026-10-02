"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dispatch this on window after creating/updating an agent to reload the list.
export const AGENTS_UPDATED_EVENT = "agents:updated";

type SidebarAgent = {
  id: number;
  name: string;
  agentImage: string | null;
};

export function AgentList() {
  const pathname = usePathname();
  const [agents, setAgents] = useState<SidebarAgent[]>([]);

  const loadAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/agent", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setAgents(data.agents ?? []);
    } catch (error) {
      console.error("Failed to load agents:", error);
    }
  }, []);

  useEffect(() => {
    loadAgents();
    window.addEventListener(AGENTS_UPDATED_EVENT, loadAgents);
    return () => window.removeEventListener(AGENTS_UPDATED_EVENT, loadAgents);
  }, [loadAgents]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">
        Your Agents
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {agents.map((agent) => (
            <SidebarMenuItem key={agent.id}>
              <SidebarMenuButton
                className="h-10 gap-3 font-medium"
                isActive={pathname === `/workspace/agent/${agent.id}`}
                render={<Link href={`/workspace/agent/${agent.id}`} />}
              >
                <Avatar className="size-6 ring-2 ring-background">
                  <AvatarImage src={agent.agentImage ?? undefined} alt={agent.name} />
                  <AvatarFallback>{agent.name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="truncate">{agent.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
