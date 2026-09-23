import { defineCollection, z } from "astro:content";

const essays = defineCollection({
  type: "content",
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
              .string()
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
