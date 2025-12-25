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
export function useSubmitProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, code, status }: { id: number; code: string; status: 'passed' | 'failed' }) => {
      const url = buildUrl(api.problems.submit.path, { id });
      const res = await fetch(url, {
        method: api.problems.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, status }),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
           // Handle validation error if needed
           throw new Error("Invalid submission");
        }
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
