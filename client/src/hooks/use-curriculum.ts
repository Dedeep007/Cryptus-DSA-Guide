import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Topic, type Problem, type Submission } from "@shared/schema";

// Topics
export function useTopics() {
  return useQuery({
    queryKey: [api.topics.list.path],
    queryFn: async () => {
      const res = await fetch(api.topics.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch topics");
      return api.topics.list.responses[200].parse(await res.json());
    },
  });
}

export function useTopic(slug: string) {
  return useQuery({
    queryKey: [api.topics.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.topics.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch topic");
      return api.topics.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

// Problems
export function useProblem(id: number) {
  return useQuery({
    queryKey: [api.problems.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.problems.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch problem");
      return api.problems.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Submissions
// Run Code (Testing)
export function useRunCode() {
  return useMutation({
    mutationFn: async ({ id, code, language }: { id: number; code: string; language: string }) => {
      const url = buildUrl(api.problems.run.path, { id });
      const res = await fetch(url, {
        method: api.problems.run.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to run code");
      }
      return api.problems.run.responses[200].parse(await res.json());
    },
  });
}

// Submissions
export function useSubmitProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, code, language }: { id: number; code: string; language: string }) => {
      const url = buildUrl(api.problems.submit.path, { id });
      const res = await fetch(url, {
        method: api.problems.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }
      return api.problems.submit.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.submissions.list.path] });
    },
  });
}

export function useSubmissions() {
  return useQuery({
    queryKey: [api.submissions.list.path],
    queryFn: async () => {
      const res = await fetch(api.submissions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return api.submissions.list.responses[200].parse(await res.json());
    },
  });
}

export interface UserStats {
  solved: number;
  total: number;
  streak: number;
  xp: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export function useTopicExamples(slug: string) {
  return useQuery({
    queryKey: [`/api/topics/${slug}/examples`],
    queryFn: async () => {
      const res = await fetch(`/api/topics/${slug}/examples`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch topic examples");
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useTopicExample(slug: string, language: string) {
  return useQuery({
    queryKey: [`/api/topics/${slug}/examples/${language}`],
    queryFn: async () => {
      const res = await fetch(`/api/topics/${slug}/examples/${language}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch topic example");
      return res.json();
    },
    enabled: !!slug && !!language,
  });
}

export function useCodeSnippets(problemId: number) {
  return useQuery({
    queryKey: [`/api/problems/${problemId}/code`],
    queryFn: async () => {
      const res = await fetch(`/api/problems/${problemId}/code`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch code snippets");
      return res.json();
    },
    enabled: !!problemId,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: [api.user.stats.path],
    queryFn: async () => {
      const res = await fetch(api.user.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch user stats");
      return api.user.stats.responses[200].parse(await res.json());
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.leaderboard.list.path],
    queryFn: async () => {
      const res = await fetch(api.leaderboard.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return api.leaderboard.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}

