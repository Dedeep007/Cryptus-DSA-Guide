import { db } from "./db";
import {
  topics, problems, submissions, users, doubts, doubtResponses, codeSnippets, topicExamples,
  type Topic, type Problem, type Submission, type User, type UpsertUser,
  type InsertTopic, type InsertProblem, type InsertSubmission, type CodeSnippet, type InsertCodeSnippet, type TopicExample
} from "@shared/schema";
import { eq, asc, desc, and, sql } from "drizzle-orm";

// XP values per difficulty
const XP_VALUES = {
  Easy: 50,
  Medium: 100,
  Hard: 200,
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

export interface IStorage {
  // User methods
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;

  // Topic methods
  getTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  getProblemsByTopicId(topicId: number): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  createProblem(problem: InsertProblem): Promise<Problem>;
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

  // Problem methods
  getAllProblems(): Promise<any[]>;
  updateProblemDescription(problemId: number, description: string): Promise<void>;
  upsertCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet>;

  // Topic example methods
  getTopicExamples(topicSlug: string): Promise<TopicExample[]>;
  getTopicExampleByLanguage(topicSlug: string, language: string): Promise<TopicExample | undefined>;
}


export class DatabaseStorage implements IStorage {
  // User methods
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

  async getProblemsByTopicId(topicId: number): Promise<Problem[]> {
    const problemList = await db.select().from(problems).where(eq(problems.topicId, topicId)).orderBy(asc(problems.order));
    return problemList.map(problem => {
      let testCases = [];
      try {
        testCases = typeof problem.testCases === 'string' ? JSON.parse(problem.testCases) : (problem.testCases || []);
      } catch (e) {
        console.error(`Error parsing testCases for problem ${problem.id}:`, e);
      }
      return { ...problem, testCases };
    });
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    if (problem) {
      let testCases = [];
      try {
        testCases = typeof problem.testCases === 'string' ? JSON.parse(problem.testCases) : (problem.testCases || []);
      } catch (e) {
        console.error(`Error parsing testCases for problem ${problem.id}:`, e);
      }
      return { ...problem, testCases };
    }
    return problem;
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const [newTopic] = await db.insert(topics).values(topic).returning();
    return newTopic;
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
    };
  }

  async getAllProblems(): Promise<any[]> {
    const problemList = await db.select().from(problems).orderBy(asc(problems.id));
    return problemList.map(problem => ({
      ...problem,
      testCases: JSON.parse(problem.testCases)
    }));
  }

  async updateProblemDescription(problemId: number, description: string): Promise<void> {
    await db.update(problems).set({ description }).where(eq(problems.id, problemId));
  }

  async upsertCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet> {
    // First try to find existing snippet
    const existing = await db.select().from(codeSnippets)
      .where(and(
        eq(codeSnippets.problemId, snippet.problemId),
        eq(codeSnippets.language, snippet.language),
        eq(codeSnippets.type, snippet.type)
      ));

    if (existing.length > 0) {
      // Update existing
      const [updated] = await db.update(codeSnippets)
        .set({ code: snippet.code })
        .where(and(
          eq(codeSnippets.problemId, snippet.problemId),
          eq(codeSnippets.language, snippet.language),
          eq(codeSnippets.type, snippet.type)
        ))
        .returning();
      return updated;
    } else {
      // Create new
      const [newSnippet] = await db.insert(codeSnippets).values(snippet).returning();
      return newSnippet;
    }
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async getUserSubmissions(userId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.userId, userId));
  }

  async getUserStats(userId: string): Promise<UserStats> {
    // Get total problems count
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(problems);
    const total = Number(totalResult[0]?.count || 0);

    // Get user's passed submissions with problem difficulties
    const userSubmissions = await db
      .select({
        problemId: submissions.problemId,
        difficulty: problems.difficulty,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .innerJoin(problems, eq(submissions.problemId, problems.id))
      .where(and(eq(submissions.userId, userId), eq(submissions.status, "passed")));

    // Get unique solved problems (only count first solve per problem)
    const solvedProblems = new Map<number, { difficulty: string; createdAt: Date | null }>();
    for (const sub of userSubmissions) {
      if (!solvedProblems.has(sub.problemId)) {
        solvedProblems.set(sub.problemId, { difficulty: sub.difficulty, createdAt: sub.createdAt });
      }
    }

    // Count by difficulty
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;
    let xp = 0;

    for (const [, { difficulty }] of Array.from(solvedProblems.entries())) {
      const normalized = difficulty?.toLowerCase().trim();
      if (normalized === "easy") {
        easyCount++;
        xp += XP_VALUES.Easy;
      } else if (normalized === "medium") {
        mediumCount++;
        xp += XP_VALUES.Medium;
      } else if (normalized === "hard") {
        hardCount++;
        xp += XP_VALUES.Hard;
      }
    }

    // Calculate streak (consecutive days with at least one solve)
    const streak = this.calculateStreak(Array.from(solvedProblems.values()).map(s => s.createdAt));

    return {
      solved: solvedProblems.size,
      total,
      streak,
      xp,
      easyCount,
      mediumCount,
      hardCount,
    };
  }

  private calculateStreak(dates: (Date | null)[]): number {
    const validDates = dates
      .filter((d): d is Date => d !== null)
      .map(d => new Date(d).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index) // unique dates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // newest first

    if (validDates.length === 0) return 0;

    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if streak is still active (solved today or yesterday)
    if (validDates[0] !== today && validDates[0] !== yesterday) {
      return 0;
    }

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

  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    // Get all users
    const allUsers = await db.select().from(users);

    // Calculate stats for each user
    const leaderboardData: LeaderboardEntry[] = [];

    for (const user of allUsers) {
      const stats = await this.getUserStats(user.id);
      leaderboardData.push({
        rank: 0, // Will be assigned after sorting
        userId: user.id,
        firstName: user.firstName || 'Anonymous',
        lastName: user.lastName || '',
        profileImageUrl: user.profileImageUrl,
        xp: stats.xp,
        solved: stats.solved,
        streak: stats.streak,
      });
    }

    // Sort by Streak (desc), then XP (desc), then Solved (desc)
    leaderboardData.sort((a, b) => {
      if (b.streak !== a.streak) return b.streak - a.streak;
      if (b.xp !== a.xp) return b.xp - a.xp;
      return b.solved - a.solved;
    });

    // Assign ranks
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return leaderboardData.slice(0, limit);
  }

  // Doubt methods
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
      doubtId,
      userId,
      response,
      isMentor,
    }).returning();
    return newResponse;
  }

  async getDoubtResponses(doubtId: number) {
    return await db.select().from(doubtResponses).where(eq(doubtResponses.doubtId, doubtId)).orderBy(asc(doubtResponses.createdAt));
  }

  // Code snippet methods
  async getCodeSnippets(problemId: number): Promise<CodeSnippet[]> {
    return await db.select().from(codeSnippets).where(and(eq(codeSnippets.problemId, problemId), eq(codeSnippets.type, 'solution')));
  }

  async getCodeSnippetByLanguage(problemId: number, language: string): Promise<CodeSnippet | undefined> {
    const [snippet] = await db.select().from(codeSnippets)
      .where(and(eq(codeSnippets.problemId, problemId), eq(codeSnippets.language, language), eq(codeSnippets.type, 'solution')));
    return snippet;
  }

  async getCodeSnippetByLanguageAndType(problemId: number, language: string, type: string): Promise<CodeSnippet | undefined> {
    const [snippet] = await db.select().from(codeSnippets)
      .where(and(eq(codeSnippets.problemId, problemId), eq(codeSnippets.language, language), eq(codeSnippets.type, type)));
    return snippet;
  }

  async createCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet> {
    const [newSnippet] = await db.insert(codeSnippets).values(snippet).returning();
    return newSnippet;
  }

  // Topic example methods
  async getTopicExamples(topicSlug: string): Promise<TopicExample[]> {
    return await db.select().from(topicExamples).where(eq(topicExamples.topicSlug, topicSlug));
  }

  async getTopicExampleByLanguage(topicSlug: string, language: string): Promise<TopicExample | undefined> {
    const [example] = await db.select().from(topicExamples)
      .where(and(eq(topicExamples.topicSlug, topicSlug), eq(topicExamples.language, language)));
    return example;
  }
}

export const storage = new DatabaseStorage();

