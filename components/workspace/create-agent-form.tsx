"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Shuffle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AGENTS_UPDATED_EVENT } from "@/components/workspace/agent-list";
import { PageHeader } from "@/components/workspace/page-header";
import { getAgentAvatar } from "@/lib/agent-avatar";

const MAX_DESCRIPTION = 200;

export function CreateAgentForm() {
  const [seed, setSeed] = useState("orbit");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const shuffleAvatar = () => setSeed(Math.random().toString(36).slice(2, 10));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          agentImage: getAgentAvatar(seed),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Failed to create agent");
        return;
      }

      window.dispatchEvent(new Event(AGENTS_UPDATED_EVENT));
      router.push("/workspace");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Create New Agent" />

      <main className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col justify-center px-6 py-4">
        <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">
          Set up your AI agent by choosing an avatar, name, and description. You can
          configure its tools and behavior later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="size-24 border shadow-sm">
              <AvatarImage src={getAgentAvatar(seed)} alt="Agent avatar" />
              <AvatarFallback>{name[0]?.toUpperCase() ?? "A"}</AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={shuffleAvatar}
              className="gap-2"
            >
              <Shuffle className="size-4" />
              Shuffle Image
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              className="h-11"
              placeholder="e.g. Research Assistant"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="agent-description">Agent Description</Label>
              <span className="text-xs text-muted-foreground">
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="agent-description"
              rows={3}
              maxLength={MAX_DESCRIPTION}
              className="resize-none"
              placeholder="e.g. Describe what this agent can help you with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t pt-5">
            <Button
              variant="outline"
              className="h-10 px-6"
              render={<Link href="/workspace" />}
              nativeButton={false}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || submitting}
              className="h-10 gap-2 px-6"
            >
              <Check className="size-4" />
              {submitting ? "Creating..." : "Create Agent"}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
