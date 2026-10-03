"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "user" | "agent";
  content: string;
  time: string;
};

type ChatPanelProps = {
  agentName: string;
  agentImage?: string | null;
  agentDescription?: string | null;
};

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function ChatPanel({ agentName, agentImage, agentDescription }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const content = input.trim();
    if (!content) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content, time: formatTime() },
    ]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const agentAvatar = (className?: string) => (
    <Avatar className={cn("size-8 border", className)}>
      <AvatarImage src={agentImage ?? undefined} alt={agentName} />
      <AvatarFallback>{agentName[0]?.toUpperCase()}</AvatarFallback>
    </Avatar>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted/30">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              {agentAvatar("size-16 shadow-sm")}
              <h2 className="text-xl font-semibold tracking-tight">{agentName}</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                {agentDescription || "Start a conversation to get going."}
              </p>
            </div>
          ) : (
            messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm">
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex items-start gap-3">
                  {agentAvatar()}
                  <div className="max-w-[80%] space-y-1">
                    <div className="flex items-baseline gap-2 text-xs">
                      <span className="font-semibold">{agentName}</span>
                      <span className="text-muted-foreground">{m.time}</span>
                    </div>
                    <div className="rounded-2xl rounded-tl-md border bg-background px-4 py-2.5 text-sm shadow-sm">
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    </div>
                  </div>
                </div>
              ),
            )
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t bg-background/80 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-blue-600/30">
          <Sparkles className="mb-2.5 ml-2 size-4 shrink-0 text-muted-foreground" />
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            placeholder={`Message ${agentName}...`}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            className="max-h-40 flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
