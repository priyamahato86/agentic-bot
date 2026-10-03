"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Settings2, SlidersHorizontal, Save, Shuffle, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AGENTS_UPDATED_EVENT } from "@/components/workspace/agent-list";
import { getAgentAvatar } from "@/lib/agent-avatar";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
  { id: "advanced", label: "Advanced", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MAX_DESCRIPTION = 200;
const MAX_INSTRUCTIONS = 2000;

type AgentConfigPanelProps = {
  agent: {
    id: number;
    name: string;
    description: string | null;
    agentImage: string | null;
    instructions: string | null;
  };
};

export function AgentConfigPanel({ agent }: AgentConfigPanelProps) {
  const router = useRouter();
  const [image, setImage] = useState(agent.agentImage ?? getAgentAvatar(agent.name));
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description ?? "");
  const [instructions, setInstructions] = useState(agent.instructions ?? "");
  const [tab, setTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const dirty =
    image !== (agent.agentImage ?? getAgentAvatar(agent.name)) ||
    name !== agent.name ||
    description !== (agent.description ?? "") ||
    instructions !== (agent.instructions ?? "");

  const shuffleAvatar = () =>
    setImage(getAgentAvatar(Math.random().toString(36).slice(2, 10)));

  const save = async () => {
    if (saving || !name.trim()) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/agent/${agent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, agentImage: image, instructions }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ ok: false, message: data.error ?? "Failed to save changes" });
        return;
      }
      setStatus({ ok: true, message: "Changes saved" });
      window.dispatchEvent(new Event(AGENTS_UPDATED_EVENT));
      router.refresh();
    } catch {
      setStatus({ ok: false, message: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="hidden w-[360px] shrink-0 flex-col border-l bg-background lg:flex">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b px-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">Agent Configuration</h2>
          <p className="truncate text-xs text-muted-foreground">
            Customize how your agent works
          </p>
        </div>
        <Button size="sm" onClick={save} disabled={!dirty || !name.trim() || saving} className="gap-1.5">
          <Save className="size-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border shadow-sm">
            <AvatarImage src={image} alt="Agent avatar" />
            <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <div>
              <p className="text-sm font-medium">Agent avatar</p>
              <p className="text-xs text-muted-foreground">Give your agent a distinct look.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={shuffleAvatar} className="gap-1.5">
              <Shuffle className="size-3.5" />
              Shuffle Avatar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="config-name">Agent Name</Label>
          <Input
            id="config-name"
            value={name}
            maxLength={255}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div role="tablist" className="-mx-5 flex border-b px-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-label={label}
              title={label}
              onClick={() => setTab(id)}
              className={cn(
                "-mb-px flex h-10 w-11 items-center justify-center border-b-2 text-muted-foreground transition-colors hover:text-foreground",
                tab === id ? "border-blue-600 text-foreground" : "border-transparent"
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>

        {tab === "general" ? (
          <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="config-description">Agent Description</Label>
              <span className="text-xs text-muted-foreground">
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="config-description"
              rows={3}
              maxLength={MAX_DESCRIPTION}
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">A short summary of what your agent does.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="config-instructions">Agent Instructions</Label>
              <span className="text-xs text-muted-foreground">
                {instructions.length}/{MAX_INSTRUCTIONS}
              </span>
            </div>
            <Textarea
              id="config-instructions"
              rows={8}
              maxLength={MAX_INSTRUCTIONS}
              className="resize-none"
              placeholder="Describe the tone, rules, and behavior your agent should follow..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
            <p className="text-sm font-medium">{TABS.find((t) => t.id === tab)?.label}</p>
            <p className="text-xs text-muted-foreground">Coming soon.</p>
          </div>
        )}

        {status && (
          <p
            role={status.ok ? "status" : "alert"}
            className={status.ok ? "text-sm text-emerald-600" : "text-sm text-destructive"}
          >
            {status.message}
          </p>
        )}
      </div>
    </aside>
  );
}
