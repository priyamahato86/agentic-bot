"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfile() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email;

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background p-2.5 shadow-xs">
      <Avatar className="size-9">
        <AvatarImage src={session?.user?.image ?? undefined} alt={name} />
        <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight">{name}</p>
        {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
      </div>
    </div>
  );
}
