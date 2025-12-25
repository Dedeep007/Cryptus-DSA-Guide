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
    submit: {
      method: 'POST' as const,
      path: '/api/problems/:id/submit',
      input: z.object({
        code: z.string(),
        status: z.enum(['passed', 'failed']),
      }),
      responses: {
        201: z.custom<typeof submissions.$inferSelect>(),
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
  }
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
