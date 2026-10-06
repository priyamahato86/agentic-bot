import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

type PageHeaderProps = {
  title: string;
  icon?: React.ReactNode; // shown before the title
  children?: React.ReactNode; // action buttons, shown on the right
};

export function PageHeader({ title, icon, children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      {icon}
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </header>
  );
}
