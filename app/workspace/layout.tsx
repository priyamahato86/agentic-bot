import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/workspace/app-sidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden">{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
