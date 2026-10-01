import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const essays = defineCollection({
  loader: glob({
    pattern: "**/index.{md,mdx}",
    base: "./src/content/essays",
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: () =>
    z.object({
      pubDatetime: z.date(),
      title: z.string(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string(),
      sources: z
        .array(
          z.object({
            title: z.string(),
            url: z
              .url()
              .refine(
                (value) => /^https?:\/\//.test(value),
                "Sources must use HTTP or HTTPS",
              ),
          }),
        )
        .optional(),
    }),
});

export const collections = { essays };
