import { db } from "./db";
import {
  topics, problems, submissions, users, doubts, doubtResponses, solutions, topicExamples,
  type Topic, type Problem, type Submission, type User, type UpsertUser,
  type InsertTopic, type InsertProblem, type InsertSubmission, type Solution, type InsertSolution, type TopicExample
} from "@shared/schema";
import { eq, asc, desc, and, sql } from "drizzle-orm";

// XP values per difficulty
const XP_VALUES: Record<string, number> = {
  easy: 50,
  medium: 100,
  hard: 200,
};

export interface UserStats {
  solved: number;
  total: number;
  streak: number;
  xp: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  xp: number;
  solved: number;
  streak: number;
}

// ==================== Storage Interface ====================

export interface IStorage {
  // User methods
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;

  // Topic methods
  getTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;

  // Topic example methods
  getTopicExamples(topicId: number): Promise<TopicExample[]>;
  getTopicExamplesBySlug(slug: string): Promise<TopicExample[]>;
  getTopicExampleByLanguage(topicId: number, language: string): Promise<TopicExample | undefined>;

  // Problem methods
  getProblemsByTopicId(topicId: number): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  getAllProblems(): Promise<Problem[]>;

  // Solution methods
  getSolutionsByProblemId(problemId: number): Promise<Solution[]>;
  getSolutionByLanguage(problemId: number, language: string): Promise<Solution | undefined>;
  createSolution(solution: InsertSolution): Promise<Solution>;

  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getUserSubmissions(userId: string): Promise<Submission[]>;
  getUserStats(userId: string): Promise<UserStats>;

  // Leaderboard
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;

  // Doubt methods
  createDoubt(doubt: { userId: string; problemId?: number; title: string; description: string; code?: string }): Promise<any>;
  getDoubts(): Promise<any[]>;
  getDoubtById(id: number): Promise<any>;
  createDoubtResponse(doubtId: number, userId: string, response: string, isMentor?: boolean): Promise<any>;
  getDoubtResponses(doubtId: number): Promise<any[]>;
}

// ==================== Database Storage Implementation ====================

export class DatabaseStorage implements IStorage {
  // ==================== User Methods ====================

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: UpsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // ==================== Topic Methods ====================

  async getTopics(): Promise<Topic[]> {
    return await db.select().from(topics).orderBy(asc(topics.order));
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.slug, slug));
    return topic;
  }

  async getTopic(id: number): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic;
  }

  // ==================== Topic Example Methods ====================

  async getTopicExamples(topicId: number): Promise<TopicExample[]> {
    return await db.select().from(topicExamples).where(eq(topicExamples.topicId, topicId));
  }

  async getTopicExamplesBySlug(slug: string): Promise<TopicExample[]> {
    const topic = await this.getTopicBySlug(slug);
    if (!topic) return [];
    return await db.select().from(topicExamples).where(eq(topicExamples.topicId, topic.id));
  }

  async getTopicExampleByLanguage(topicId: number, language: string): Promise<TopicExample | undefined> {
    const [example] = await db.select().from(topicExamples)
      .where(and(eq(topicExamples.topicId, topicId), eq(topicExamples.language, language)));
    return example;
  }

  // ==================== Problem Methods ====================

  async getProblemsByTopicId(topicId: number): Promise<Problem[]> {
    const problemList = await db.select().from(problems)
      .where(eq(problems.topicId, topicId))
      .orderBy(asc(problems.order));

    return problemList.map(problem => {
      let testCases = [];
      try {
        testCases = typeof problem.testCases === 'string'
          ? JSON.parse(problem.testCases)
          : (problem.testCases || []);
      } catch (e) {
        console.error(`Error parsing testCases for problem ${problem.id}:`, e);
      }
      return { ...problem, testCases } as any;
    });
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    if (problem) {
      let testCases = [];
      try {
        testCases = typeof problem.testCases === 'string'
          ? JSON.parse(problem.testCases)
          : (problem.testCases || []);
      } catch (e) {
        console.error(`Error parsing testCases for problem ${problem.id}:`, e);
      }
      return { ...problem, testCases } as any;
    }
    return problem;
  }

  async createProblem(problem: InsertProblem): Promise<Problem> {
    const problemData = {
      ...problem,
      testCases: JSON.stringify(problem.testCases)
    };
    const [newProblem] = await db.insert(problems).values(problemData).returning();
    return {
      ...newProblem,
      testCases: JSON.parse(newProblem.testCases)
    } as any;
  }

  async getAllProblems(): Promise<Problem[]> {
    const problemList = await db.select().from(problems).orderBy(asc(problems.id));
    return problemList.map(problem => ({
      ...problem,
      testCases: JSON.parse(problem.testCases)
    })) as any;
  }

  // ==================== Solution Methods ====================

  async getSolutionsByProblemId(problemId: number): Promise<Solution[]> {
    return await db.select().from(solutions).where(eq(solutions.problemId, problemId));
  }

  async getSolutionByLanguage(problemId: number, language: string): Promise<Solution | undefined> {
    const [solution] = await db.select().from(solutions)
      .where(and(eq(solutions.problemId, problemId), eq(solutions.language, language)));
    return solution;
  }

  async createSolution(solution: InsertSolution): Promise<Solution> {
    const [newSolution] = await db.insert(solutions).values(solution).returning();
    return newSolution;
  }

  // Legacy alias methods for backward compatibility (deprecated)
  async getCodeSnippets(problemId: number): Promise<Solution[]> {
    return this.getSolutionsByProblemId(problemId);
  }

  async getCodeSnippetByLanguage(problemId: number, language: string): Promise<Solution | undefined> {
    return this.getSolutionByLanguage(problemId, language);
  }

  async upsertCodeSnippet(snippet: InsertSolution): Promise<Solution> {
    const existing = await db.select().from(solutions)
      .where(and(
        eq(solutions.problemId, snippet.problemId),
        eq(solutions.language, snippet.language)
      ));

    if (existing.length > 0) {
      const [updated] = await db.update(solutions)
        .set({ code: snippet.code })
        .where(and(
          eq(solutions.problemId, snippet.problemId),
          eq(solutions.language, snippet.language)
        ))
        .returning();
      return updated;
    } else {
      const [newSolution] = await db.insert(solutions).values(snippet).returning();
      return newSolution;
    }
  }

  // ==================== Submission Methods ====================

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.userId, userId));
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(problems);
    const total = Number(totalResult[0]?.count || 0);

    const userSubmissions = await db
      .select({
        problemId: submissions.problemId,
        difficulty: problems.difficulty,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .innerJoin(problems, eq(submissions.problemId, problems.id))
      .where(and(eq(submissions.userId, userId), eq(submissions.status, "passed")));

    const solvedProblems = new Map<number, { difficulty: string; createdAt: Date | null }>();
    for (const sub of userSubmissions) {
      if (!solvedProblems.has(sub.problemId)) {
        solvedProblems.set(sub.problemId, { difficulty: sub.difficulty, createdAt: sub.createdAt });
      }
    }

    let easyCount = 0, mediumCount = 0, hardCount = 0, xp = 0;

    for (const [, { difficulty }] of Array.from(solvedProblems.entries())) {
      const normalized = difficulty?.toLowerCase().trim();
      if (normalized === "easy") { easyCount++; xp += XP_VALUES.easy; }
      else if (normalized === "medium") { mediumCount++; xp += XP_VALUES.medium; }
      else if (normalized === "hard") { hardCount++; xp += XP_VALUES.hard; }
    }

    const streak = this.calculateStreak(Array.from(solvedProblems.values()).map(s => s.createdAt));

    return { solved: solvedProblems.size, total, streak, xp, easyCount, mediumCount, hardCount };
  }

  private calculateStreak(dates: (Date | null)[]): number {
    const validDates = dates
      .filter((d): d is Date => d !== null)
      .map(d => new Date(d).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (validDates.length === 0) return 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (validDates[0] !== today && validDates[0] !== yesterday) return 0;

    let streak = 1;
    let currentDate = new Date(validDates[0]);

    for (let i = 1; i < validDates.length; i++) {
      const prevDate = new Date(currentDate.getTime() - 86400000).toDateString();
      if (validDates[i] === prevDate) {
        streak++;
        currentDate = new Date(validDates[i]);
      } else {
        break;
      }
    }

    return streak;
  }

  // ==================== Leaderboard ====================

  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    const allUsers = await db.select().from(users);
    const leaderboardData: LeaderboardEntry[] = [];

    for (const user of allUsers) {
      const stats = await this.getUserStats(user.id);
      leaderboardData.push({
        rank: 0,
        userId: user.id,
        firstName: user.firstName || 'Anonymous',
        lastName: user.lastName || '',
        profileImageUrl: user.profileImageUrl,
        xp: stats.xp,
        solved: stats.solved,
        streak: stats.streak,
      });
    }

    leaderboardData.sort((a, b) => {
      if (b.streak !== a.streak) return b.streak - a.streak;
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.solved - a.solved;
    });

    leaderboardData.forEach((entry, index) => { entry.rank = index + 1; });

    return leaderboardData.slice(0, limit);
  }

  // ==================== Doubt Methods ====================

  async createDoubt(doubt: { userId: string; problemId?: number; title: string; description: string; code?: string }) {
    const [newDoubt] = await db.insert(doubts).values(doubt).returning();
    return newDoubt;
  }

  async getDoubts() {
    return await db.select().from(doubts).orderBy(desc(doubts.createdAt));
  }

  async getDoubtById(id: number) {
    const [doubt] = await db.select().from(doubts).where(eq(doubts.id, id));
    return doubt;
  }

  async createDoubtResponse(doubtId: number, userId: string, response: string, isMentor = false) {
    const [newResponse] = await db.insert(doubtResponses).values({
      doubtId, userId, response, isMentor,
    }).returning();
    return newResponse;
  }

  async getDoubtResponses(doubtId: number) {
    return await db.select().from(doubtResponses)
      .where(eq(doubtResponses.doubtId, doubtId))
      .orderBy(asc(doubtResponses.createdAt));
  }
}

export const storage = new DatabaseStorage();
