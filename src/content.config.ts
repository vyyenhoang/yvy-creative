import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One case study = one folder in /projects/<slug>/ with a project.md inside.
 * The folder name becomes the URL: /work/<slug>/
 */

const metric = z.object({
  value: z.string(), // "11K+", "$15,000", "+25%"
  label: z.string(),
  detail: z.string().optional(),
});

export const LAYOUTS = ['auto', 'masonry', 'feed', 'wide', 'duo', 'trio', 'bento', 'phone', 'strip', 'compare'] as const;

const chapter = z.object({
  folder: z.string().optional(), // sub-folder holding this chapter's designs
  kicker: z.string().optional(), // small label above the title
  title: z.string().optional(), // defaults to a prettified folder name
  text: z.string().optional(),
  layout: z.enum(LAYOUTS).default('auto'),
  columns: z.number().int().min(1).max(6).optional(),
  pills: z.array(z.string()).default([]), // content pillars, formats, deliverables…
  steps: z.array(z.string()).default([]), // a mini workflow for this chapter
  swatches: z.array(z.object({ hex: z.string(), name: z.string().optional() })).default([]),
  typefaces: z.array(z.object({ name: z.string(), role: z.string().optional() })).default([]),
  captions: z.boolean().default(false), // show the file name under each visual
});

const projects = defineCollection({
  loader: glob({
    pattern: '*/project.md',
    base: './projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    draft: z.boolean().default(false), // drafts show locally, hidden on the live site
    color: z.string().default('#15130F'), // brand colour used across the case study
    category: z.string(),
    year: z.string(),
    role: z.string(),
    type: z.string().optional(),
    industry: z.string().optional(),
    website: z.string().optional(),
    tagline: z.string(),
    summary: z.string(),
    services: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    stats: z.array(metric).default([]),
    keywords: z.array(z.string()).default([]),
    thinking: z
      .array(z.object({ label: z.string(), title: z.string().optional(), text: z.string() }))
      .default([]),
    process: z.array(z.object({ title: z.string(), text: z.string().optional() })).default([]),
    chapters: z.array(chapter).default([]),
    results: z
      .object({
        title: z.string().optional(),
        intro: z.string().optional(),
        metrics: z.array(metric).default([]),
        quote: z.object({ text: z.string(), by: z.string().optional() }).optional(),
      })
      .optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }),
});

export const collections = { projects };
