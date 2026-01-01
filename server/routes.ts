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

  // ==================== Topic Routes ====================

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
    const examples = await storage.getTopicExamples(topic.id);

    res.json({ ...topic, problems, codeExamples: examples });
  });

  // Topic examples endpoint - get all examples for a topic
  app.get("/api/topics/:slug/examples", async (req, res) => {
    const slug = req.params.slug;
    const examples = await storage.getTopicExamplesBySlug(slug);
    res.json(examples);
  });

  // Topic example by language endpoint
  app.get("/api/topics/:slug/examples/:language", async (req, res) => {
    const slug = req.params.slug;
    const language = req.params.language;

    const topic = await storage.getTopicBySlug(slug);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const example = await storage.getTopicExampleByLanguage(topic.id, language);
    if (!example) {
      return res.status(404).json({ message: `No example available for ${language}` });
    }
    res.json(example);
  });

  // ==================== Problem Routes ====================

  app.get(api.problems.get.path, async (req, res) => {
    const problem = await storage.getProblem(Number(req.params.id));
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Get solutions for this problem
    const solutions = await storage.getSolutionsByProblemId(problem.id);

    res.json({ ...problem, solutions });
  });

  // Get solutions for a problem
  app.get("/api/problems/:id/solutions", async (req, res) => {
    const problemId = Number(req.params.id);
    if (isNaN(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }
    const solutions = await storage.getSolutionsByProblemId(problemId);
    res.json(solutions);
  });

  // Get solution by language
  app.get("/api/problems/:id/solutions/:language", async (req, res) => {
    const problemId = Number(req.params.id);
    const language = req.params.language;

    if (isNaN(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const solution = await storage.getSolutionByLanguage(problemId, language);
    if (!solution) {
      return res.status(404).json({ message: `No solution available for ${language}` });
    }
    res.json(solution);
  });

  // Legacy code snippets endpoint (deprecated - use /solutions instead)
  app.get("/api/problems/:id/code", async (req, res) => {
    const problemId = Number(req.params.id);
    if (isNaN(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }
    const snippets = await storage.getSolutionsByProblemId(problemId);
    res.json(snippets);
  });

  app.get("/api/problems/:id/code/:language", async (req, res) => {
    const problemId = Number(req.params.id);
    const language = req.params.language;

    if (isNaN(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const solution = await storage.getSolutionByLanguage(problemId, language);
    if (!solution) {
      return res.status(404).json({ message: `No code available for ${language}` });
    }
    res.json(solution);
  });

  // ==================== Code Execution Routes ====================

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
        language: language,
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

  // ==================== Submission Routes ====================

  app.get(api.submissions.list.path, isAuthenticated, async (req, res) => {
    const submissions = await storage.getUserSubmissions((req.user as User).id);
    res.json(submissions);
  });

  // ==================== User Stats & Leaderboard ====================

  app.get(api.user.stats.path, isAuthenticated, async (req, res) => {
    const stats = await storage.getUserStats((req.user as User).id);
    res.json(stats);
  });

  app.get(api.leaderboard.list.path, async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // ==================== AI Assistant Routes ====================

  app.post("/api/ai/chat", isAuthenticated, async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await generateAIResponse(message, context);
      res.json({ response });
    } catch (err) {
      console.error('AI chat error:', err);
      res.json({
        response: "I'm having a brief moment. Please try again in a few seconds! 💫"
      });
    }
  });

  // Database should be seeded via ingestion script, not auto-seeded
  console.log('📦 Routes registered. Run ingest-merged-data.ts to populate database.');

  return httpServer;
}
