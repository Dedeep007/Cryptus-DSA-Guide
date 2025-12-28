import { z } from 'zod';
import { insertTopicSchema, insertProblemSchema, insertSubmissionSchema, topics, problems, submissions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  topics: {
    list: {
      method: 'GET' as const,
      path: '/api/topics',
      responses: {
        200: z.array(z.custom<typeof topics.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/topics/:slug',
      responses: {
        200: z.custom<typeof topics.$inferSelect & { problems: (typeof problems.$inferSelect)[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  problems: {
    get: {
      method: 'GET' as const,
      path: '/api/problems/:id',
      responses: {
        200: z.custom<typeof problems.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    run: {
      method: 'POST' as const,
      path: '/api/problems/:id/run',
      input: z.object({
        code: z.string(),
        language: z.string(),
      }),
      responses: {
        200: z.array(z.object({
          input: z.string(),
          expected: z.string(),
          actual: z.string(),
          passed: z.boolean(),
          error: z.string().optional(),
        })),
        400: errorSchemas.validation,
      },
    },
    submit: {
      method: 'POST' as const,
      path: '/api/problems/:id/submit',
      input: z.object({
        code: z.string(),
        language: z.string(),
      }),
      responses: {
        201: z.object({
          submission: z.custom<typeof submissions.$inferSelect>(),
          results: z.array(z.object({
            input: z.string(),
            expected: z.string(),
            actual: z.string(),
            passed: z.boolean(),
          })),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  submissions: {
    list: {
      method: 'GET' as const,
      path: '/api/submissions',
      responses: {
        200: z.array(z.custom<typeof submissions.$inferSelect>()),
      },
    },
  },
  user: {
    stats: {
      method: 'GET' as const,
      path: '/api/user/stats',
      responses: {
        200: z.object({
          solved: z.number(),
          total: z.number(),
          streak: z.number(),
          xp: z.number(),
          easyCount: z.number(),
          mediumCount: z.number(),
          hardCount: z.number(),
        }),
      },
    },
  },
  leaderboard: {
    list: {
      method: 'GET' as const,
      path: '/api/leaderboard',
      responses: {
        200: z.array(z.object({
          rank: z.number(),
          userId: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          profileImageUrl: z.string().nullable(),
          xp: z.number(),
          solved: z.number(),
          streak: z.number(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
