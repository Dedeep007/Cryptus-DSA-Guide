import { pgTable, text, integer, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";

// Type definitions
export interface TestCase {
  input: string;
  output: string;
}

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
  testCases: text("test_cases").notNull(), // JSON string of TestCase[]
  conceptExplanation: text("concept_explanation").notNull(),
  workedExample: text("worked_example").notNull(), // Markdown
  submissionFormat: text("submission_format").notNull(),
  order: integer("order").notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // From auth user id (string)
  problemId: integer("problem_id").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(), // "passed", "failed"
  createdAt: timestamp("created_at").defaultNow(),
});

export const doubts = pgTable("doubts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  problemId: integer("problem_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  code: text("code"),
  status: text("status").default("open"), // "open", "resolved"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doubtResponses = pgTable("doubt_responses", {
  id: serial("id").primaryKey(),
  doubtId: integer("doubt_id").notNull(),
  userId: text("user_id").notNull(),
  response: text("response").notNull(),
  isMentor: boolean("is_mentor").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Code snippets for multi-language support
export const codeSnippets = pgTable("code_snippets", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id").notNull(),
  language: text("language").notNull(), // "cpp", "python", "java", "c", "javascript"
  type: text("type").notNull().default("solution"), // "solution", "example", "input-output"
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Topic examples for algorithm guide
export const topicExamples = pgTable("topic_examples", {
  id: serial("id").primaryKey(),
  topicSlug: text("topic_slug").notNull(),
  language: text("language").notNull(), // "cpp", "python", "java", "javascript"
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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
export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({ id: true, createdAt: true });
export const insertTopicExampleSchema = createInsertSchema(topicExamples).omit({ id: true, createdAt: true });

export type Topic = typeof topics.$inferSelect;
export type Problem = typeof problems.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type TopicExample = typeof topicExamples.$inferSelect;

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;
export type InsertTopicExample = z.infer<typeof insertTopicExampleSchema>;

