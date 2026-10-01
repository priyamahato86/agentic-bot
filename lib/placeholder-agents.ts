import { getAgentAvatar as avatar } from "@/lib/agent-avatar";

export type Agent = {
  id: string;
  name: string;
  image: string;
};

// Placeholder data until agents are loaded from the database.
export const placeholderAgents: Agent[] = [
  { id: "1", name: "Research Assistant", image: avatar("research") },
  { id: "2", name: "Code Reviewer", image: avatar("reviewer") },
  { id: "3", name: "Support Bot", image: avatar("support") },
  { id: "4", name: "Content Writer", image: avatar("writer") },
];
