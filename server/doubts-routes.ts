import { Router } from "express";
import { z } from "zod";
import { storage } from "./storage";
import type { UserInterface as User } from "@shared/models/auth";

const router = Router();

// Validation schemas
const createDoubtSchema = z.object({
  problemId: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  code: z.string().optional(),
});

const createResponseSchema = z.object({
  response: z.string().min(1),
});

// Get all doubts
router.get("/", async (req, res) => {
  try {
    const doubts = await storage.getDoubts();
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doubts" });
  }
});

// Get doubt by ID with responses
router.get("/:id", async (req, res) => {
  try {
    const doubtId = parseInt(req.params.id);
    const doubt = await storage.getDoubtById(doubtId);

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    const responses = await storage.getDoubtResponses(doubtId);
    res.json({ ...doubt, responses });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doubt" });
  }
});

// Create a new doubt
router.post("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { problemId, title, description, code } = createDoubtSchema.parse(req.body);

    const doubt = await storage.createDoubt({
      userId: (req.user as any).id,
      problemId,
      title,
      description,
      code,
    });

    res.status(201).json(doubt);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Failed to create doubt" });
  }
});

// Add response to a doubt
router.post("/:id/responses", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const doubtId = parseInt(req.params.id);
    const { response } = createResponseSchema.parse(req.body);

    // Check if doubt exists
    const doubt = await storage.getDoubtById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    const doubtResponse = await storage.createDoubtResponse(
      doubtId,
      (req.user as any).id,
      response,
      false // Not a mentor for now
    );

    res.status(201).json(doubtResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Failed to add response" });
  }
});

export { router as doubtsRouter };