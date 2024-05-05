import { defineCollection, z } from "astro:content";

const sketchesCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  sketchbooks: sketchesCollection,
};
