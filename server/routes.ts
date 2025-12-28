import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import { authRouter } from "./auth-routes";
import { doubtsRouter } from "./doubts-routes";
import type { UserInterface as User } from "@shared/models/auth";
import { executeCode } from "./executor";
import { generateAIResponse, getFallbackResponse } from "./ai-service";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Middleware for authentication
const isAuthenticated = (req: Request, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Auth routes
  app.use("/api/auth", authRouter);

  // Doubts routes
  app.use("/api/doubts", isAuthenticated, doubtsRouter);

  // Application Routes

  app.get(api.topics.list.path, async (req, res) => {
    const topics = await storage.getTopics();
    res.json(topics);
  });

  app.get(api.topics.get.path, async (req, res) => {
    const slug = req.params.slug;
    let topic = await storage.getTopicBySlug(slug);

    // If not found by slug and the param looks like an ID, try fetching by ID
    if (!topic && /^\d+$/.test(slug)) {
      topic = await storage.getTopic(Number(slug));
    }

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    const problems = await storage.getProblemsByTopicId(topic.id);
    res.json({ ...topic, problems });
  });

  app.get(api.problems.get.path, async (req, res) => {
    const problem = await storage.getProblem(Number(req.params.id));
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  });

  app.post(api.problems.run.path, async (req, res) => {
    try {
      const problemId = Number(req.params.id);
      const { code, language } = api.problems.run.input.parse(req.body);

      const problem = await storage.getProblem(problemId);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      const testCases = (problem.testCases as any[]) || [];
      // Run only visible test cases (the first one)
      const visibleTestCases = testCases.slice(0, 1);
      const results = await executeCode(language, code, visibleTestCases, [false]);

      res.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.post(api.problems.submit.path, isAuthenticated, async (req, res) => {
    try {
      const problemId = Number(req.params.id);
      const { code, language } = api.problems.submit.input.parse(req.body);

      const problem = await storage.getProblem(problemId);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      const testCases = (problem.testCases as any[]) || [];
      // Treat first test case as visible, others as hidden
      const isHiddenMap = testCases.map((_, i) => i > 0);
      const results = await executeCode(language, code, testCases, isHiddenMap);

      const allPassed = results.every(r => r.passed);
      const status = allPassed ? "passed" : "failed";

      const submission = await storage.createSubmission({
        userId: (req.user as User).id,
        problemId: problemId,
        code,
        status,
      });

      res.status(201).json({ submission, results });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.get(api.submissions.list.path, isAuthenticated, async (req, res) => {
    const submissions = await storage.getUserSubmissions((req.user as User).id);
    res.json(submissions);
  });

  // User stats endpoint
  app.get(api.user.stats.path, isAuthenticated, async (req, res) => {
    const stats = await storage.getUserStats((req.user as User).id);
    res.json(stats);
  });

  // Leaderboard endpoint
  app.get(api.leaderboard.list.path, async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // AI Assistant chat endpoint
  app.post("/api/ai/chat", isAuthenticated, async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Pass context to AI (includes page, problem info, user code)
      const response = await generateAIResponse(message, context);
      res.json({ response });
    } catch (err) {
      console.error('AI chat error:', err);
      // Return a user-friendly error
      res.json({
        response: "I'm having a brief moment. Please try again in a few seconds! 💫"
      });
    }
  });

  // Code snippets endpoint - get all snippets for a problem
  app.get("/api/problems/:id/code", async (req, res) => {
    const problemId = Number(req.params.id);
    if (isNaN(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }
    const snippets = await storage.getCodeSnippets(problemId);
    res.json(snippets);
  });

  // Code snippet by language endpoint
  app.get("/api/problems/:id/code/:language", async (req, res) => {
    const problemId = Number(req.params.id);
    const language = req.params.language;
    const type = req.query.type as string || 'solution';

    if (isNaN(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const snippet = await storage.getCodeSnippetByLanguageAndType(problemId, language, type);
    if (!snippet) {
      return res.status(404).json({ message: `No ${type} code available for ${language}` });
    }
    res.json(snippet);
  });

  // Topic examples endpoint - get all examples for a topic
  app.get("/api/topics/:slug/examples", async (req, res) => {
    const slug = req.params.slug;
    const examples = await storage.getTopicExamples(slug);
    res.json(examples);
  });

  // Topic example by language endpoint
  app.get("/api/topics/:slug/examples/:language", async (req, res) => {
    const slug = req.params.slug;
    const language = req.params.language;

    const example = await storage.getTopicExampleByLanguage(slug, language);
    if (!example) {
      return res.status(404).json({ message: `No example available for ${language}` });
    }
    res.json(example);
  });

  // Seed Data (if empty)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingTopics = await storage.getTopics();
  if (existingTopics.length === 0) {
    const arraysTopic = await storage.createTopic({
      title: "Arrays",
      description: "Learn about array data structures and common algorithms.",
      order: 1,
      slug: "arrays",
    });

    await storage.createProblem({
      topicId: arraysTopic.id,
      title: "Two Sum",
      difficulty: "Easy",
      order: 1,
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      initialCode: "function twoSum(nums, target) {\n  // Your code here\n}",
      testCases: JSON.stringify([
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
      ]),
      conceptExplanation: "The Two Sum problem can be solved efficiently using a Hash Map to store the complements of numbers seen so far.",
      workedExample: "Example: nums = [2, 7, 11, 15], target = 9. \n1. Visit 2, needed: 7. Map: {2: 0}\n2. Visit 7, needed: 2. 2 is in map. Return [0, 1].",
    });

    const linkedListsTopic = await storage.createTopic({
      title: "Linked Lists",
      description: "Understand singly and doubly linked lists.",
      order: 2,
      slug: "linked-lists",
    });

    await storage.createProblem({
      topicId: linkedListsTopic.id,
      title: "Reverse Linked List",
      difficulty: "Medium",
      order: 1,
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      initialCode: "function reverseList(head) {\n  // Your code here\n}",
      testCases: JSON.stringify([
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
      ]),
      conceptExplanation: "To reverse a linked list, you need to change the `next` pointer of each node to point to the previous node.",
      workedExample: "Iterate through the list, keeping track of `prev`, `current`, and `next` nodes. At each step, `current.next = prev`.",
    });
  }
}
