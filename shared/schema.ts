export * from "./models/auth";
export * from "./models/chat";
import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  slug: text("slug").notNull().unique(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  description: text("description").notNull(), // Markdown
  initialCode: text("initial_code").notNull(),
  testCases: jsonb("test_cases").notNull(), // Array of {input, output}
  conceptExplanation: text("concept_explanation").notNull(),
  workedExample: text("worked_example").notNull(), // Markdown
  order: integer("order").notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // From auth user id (string)
  problemId: integer("problem_id").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(), // "passed", "failed"
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"), 
});

export const topicsRelations = relations(topics, ({ many }) => ({
  problems: many(problems),
}));

export const problemsRelations = relations(problems, ({ one }) => ({
  topic: one(topics, {
    fields: [problems.topicId],
    references: [topics.id],
  }),
}));

export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });
export const insertProblemSchema = createInsertSchema(problems).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true });

export type Topic = typeof topics.$inferSelect;
export type Problem = typeof problems.$inferSelect;
export type Submission = typeof submissions.$inferSelect;

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
