import { db } from "./db";
import {
  topics, problems, submissions,
  type Topic, type Problem, type Submission,
  type InsertTopic, type InsertProblem, type InsertSubmission
} from "@shared/schema";
import { eq, asc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";
import { chatStorage, type IChatStorage } from "./replit_integrations/chat/storage";

export interface IStorage extends IAuthStorage, IChatStorage {
  getTopics(): Promise<Topic[]>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  getProblemsByTopicId(topicId: number): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getUserSubmissions(userId: string): Promise<Submission[]>;
}

export class DatabaseStorage implements IStorage {
  // Inherit methods from authStorage and chatStorage
  getUser = authStorage.getUser.bind(authStorage);
  upsertUser = authStorage.upsertUser.bind(authStorage);
  getConversation = chatStorage.getConversation.bind(chatStorage);
  getAllConversations = chatStorage.getAllConversations.bind(chatStorage);
  createConversation = chatStorage.createConversation.bind(chatStorage);
  deleteConversation = chatStorage.deleteConversation.bind(chatStorage);
  getMessagesByConversation = chatStorage.getMessagesByConversation.bind(chatStorage);
  createMessage = chatStorage.createMessage.bind(chatStorage);

  async getTopics(): Promise<Topic[]> {
    return await db.select().from(topics).orderBy(asc(topics.order));
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.slug, slug));
    return topic;
  }

  async getProblemsByTopicId(topicId: number): Promise<Problem[]> {
    return await db.select().from(problems).where(eq(problems.topicId, topicId)).orderBy(asc(problems.order));
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const [newTopic] = await db.insert(topics).values(topic).returning();
    return newTopic;
  }

  async createProblem(problem: InsertProblem): Promise<Problem> {
    const [newProblem] = await db.insert(problems).values(problem).returning();
    return newProblem;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.userId, userId));
  }
}

export const storage = new DatabaseStorage();
