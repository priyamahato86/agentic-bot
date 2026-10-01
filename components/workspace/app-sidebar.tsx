import Link from "next/link";
import { Orbit, Plus, Store } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AgentList } from "@/components/workspace/agent-list";
import { UserProfile } from "@/components/workspace/user-profile";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="gap-5 p-4">
        <Link href="/workspace" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
            <Orbit className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Orbit</span>
        </Link>

        <Button
          render={<Link href="/workspace/agents/new" />}
          nativeButton={false}
          className="h-10 w-full justify-center gap-2 font-medium"
        >
          <Plus className="size-4" />
          Create New Agent
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <AgentList />
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10"
              render={<Link href="/workspace/marketplace" />}
            >
              <Store />
              <span>Marketplace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
