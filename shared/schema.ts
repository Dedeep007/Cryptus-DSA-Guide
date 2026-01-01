import { pgTable, text, integer, serial, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";

// ==================== Type Definitions ====================

export interface TestCase {
  input: string;
  output: string;
}

export interface Solution {
  language: string;  // "cpp", "c", "python", "java", "javascript"
  code: string;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

// ==================== Database Tables ====================

// Topics table - stores DSA topic metadata
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Topic code examples - example code for each topic by language
export const topicExamples = pgTable("topic_examples", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  language: text("language").notNull(), // "cpp", "c", "python", "java", "javascript"
  code: text("code").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Problems table - stores problem metadata and content
export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(), // Problem statement
  difficulty: text("difficulty").notNull(), // "easy", "medium", "hard"
  testCases: text("test_cases").notNull(), // JSON string of TestCase[]
  conceptExplanation: text("concept_explanation").notNull(),
  submissionFormat: text("submission_format").notNull(), // Function signature hints
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Problem solutions - solution code for each problem by language
export const solutions = pgTable("solutions", {
  id: serial("id").primaryKey(),
  problemId: integer("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  language: text("language").notNull(), // "cpp", "c", "python", "java", "javascript"
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User submissions - tracks user code submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  problemId: integer("problem_id").notNull().references(() => problems.id, { onDelete: "cascade" }),
  language: text("language").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull(), // "passed", "failed"
  createdAt: timestamp("created_at").defaultNow(),
});

// Doubts table - user questions/doubts
export const doubts = pgTable("doubts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  problemId: integer("problem_id").references(() => problems.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  code: text("code"),
  status: text("status").default("open"), // "open", "resolved"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Doubt responses - responses to doubts
export const doubtResponses = pgTable("doubt_responses", {
  id: serial("id").primaryKey(),
  doubtId: integer("doubt_id").notNull().references(() => doubts.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  response: text("response").notNull(),
  isMentor: boolean("is_mentor").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== Relations ====================

export const topicsRelations = relations(topics, ({ many }) => ({
  problems: many(problems),
  examples: many(topicExamples),
}));

export const topicExamplesRelations = relations(topicExamples, ({ one }) => ({
  topic: one(topics, {
    fields: [topicExamples.topicId],
    references: [topics.id],
  }),
}));

export const problemsRelations = relations(problems, ({ one, many }) => ({
  topic: one(topics, {
    fields: [problems.topicId],
    references: [topics.id],
  }),
  solutions: many(solutions),
  submissions: many(submissions),
}));

export const solutionsRelations = relations(solutions, ({ one }) => ({
  problem: one(problems, {
    fields: [solutions.problemId],
    references: [problems.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
}));

export const doubtsRelations = relations(doubts, ({ one, many }) => ({
  problem: one(problems, {
    fields: [doubts.problemId],
    references: [problems.id],
  }),
  responses: many(doubtResponses),
}));

export const doubtResponsesRelations = relations(doubtResponses, ({ one }) => ({
  doubt: one(doubts, {
    fields: [doubtResponses.doubtId],
    references: [doubts.id],
  }),
}));

// ==================== Insert Schemas ====================

export const insertTopicSchema = createInsertSchema(topics).omit({ id: true, createdAt: true });
export const insertTopicExampleSchema = createInsertSchema(topicExamples).omit({ id: true, createdAt: true });
export const insertProblemSchema = createInsertSchema(problems).omit({ id: true, createdAt: true });
export const insertSolutionSchema = createInsertSchema(solutions).omit({ id: true, createdAt: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true });
export const insertDoubtSchema = createInsertSchema(doubts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDoubtResponseSchema = createInsertSchema(doubtResponses).omit({ id: true, createdAt: true });

// ==================== Types ====================

export type Topic = typeof topics.$inferSelect;
export type TopicExample = typeof topicExamples.$inferSelect;
export type Problem = typeof problems.$inferSelect;
export type Solution = typeof solutions.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Doubt = typeof doubts.$inferSelect;
export type DoubtResponse = typeof doubtResponses.$inferSelect;

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertTopicExample = z.infer<typeof insertTopicExampleSchema>;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type InsertSolution = z.infer<typeof insertSolutionSchema>;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type InsertDoubt = z.infer<typeof insertDoubtSchema>;
export type InsertDoubtResponse = z.infer<typeof insertDoubtResponseSchema>;

// Legacy alias for backward compatibility
export const codeSnippets = solutions;
export type CodeSnippet = Solution;
export type InsertCodeSnippet = InsertSolution;
