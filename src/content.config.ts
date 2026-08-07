import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { NOTE_CATEGORIES } from './lib/categories';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(NOTE_CATEGORIES),
    pdf: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eventDate: z.coerce.date(),
    location: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, blog, events };
