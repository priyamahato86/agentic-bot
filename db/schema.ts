import { boolean, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: serial("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const AgentConfig = pgTable("agentConfig", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  agentImage: text("agentImage"),
  instructions: text("instructions"),
  tools: jsonb("tools"),
  composioSessionId: varchar("composioSessionId"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userEmail: text("userEmail")
    .notNull()
    .references(() => users.email),
});

export const Tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: varchar("category", { length: 100 }).default("General"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User =typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Agent = typeof AgentConfig.$inferSelect;
export type NewAgent = typeof AgentConfig.$inferInsert;
export type Tool = typeof Tools.$inferSelect;
export type NewTool = typeof Tools.$inferInsert;
