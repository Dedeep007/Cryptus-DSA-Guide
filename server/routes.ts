import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // Application Routes

  app.get(api.topics.list.path, async (req, res) => {
    const topics = await storage.getTopics();
    res.json(topics);
  });

  app.get(api.topics.get.path, async (req, res) => {
    const topic = await storage.getTopicBySlug(req.params.slug);
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

  app.post(api.problems.submit.path, isAuthenticated, async (req, res) => {
    try {
      const { code, status } = api.problems.submit.input.parse(req.body);
      const submission = await storage.createSubmission({
        userId: (req.user as any).claims.sub,
        problemId: Number(req.params.id),
        code,
        status,
      });
      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.submissions.list.path, isAuthenticated, async (req, res) => {
    const submissions = await storage.getUserSubmissions((req.user as any).claims.sub);
    res.json(submissions);
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
      testCases: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
      ],
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
      testCases: [
         { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
      ],
      conceptExplanation: "To reverse a linked list, you need to change the `next` pointer of each node to point to the previous node.",
      workedExample: "Iterate through the list, keeping track of `prev`, `current`, and `next` nodes. At each step, `current.next = prev`.",
    });
  }
}
