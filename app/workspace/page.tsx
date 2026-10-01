import { PageHeader } from "@/components/workspace/page-header";

export default function WorkspacePage() {
  return (
    <>
      <PageHeader title="Workspace" />
      <main className="p-6">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome to Orbit</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select an agent from the sidebar or create a new one.
        </p>
      </main>
    </>
  );
}
