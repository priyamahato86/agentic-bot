"use client";

import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderAgents } from "@/lib/placeholder-agents";

export function AgentList() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">
        Your Agents
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {placeholderAgents.map((agent) => (
            <SidebarMenuItem key={agent.id}>
              <SidebarMenuButton
                className="h-10 gap-3 font-medium"
                isActive={activeId === agent.id}
                onClick={() => setActiveId(agent.id)}
              >
                <Avatar className="size-6 ring-2 ring-background">
                  <AvatarImage src={agent.image} alt={agent.name} />
                  <AvatarFallback>{agent.name[0]}</AvatarFallback>
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
