#!/usr/bin/env node
// Scaffold a new case study:  npm run new -- "Company Name"
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const name = process.argv.slice(2).join(' ').trim();
if (!name) {
  console.error('Usage: npm run new -- "Company Name"');
  process.exit(1);
}

const slug = name
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');
const dir = join('projects', slug);
if (existsSync(dir)) {
  console.error(`projects/${slug} already exists.`);
  process.exit(1);
}

const chapters = ['01-brand-identity', '02-social-media', '03-marketing-materials', '04-video'];
for (const c of chapters) {
  mkdirSync(join(dir, c), { recursive: true });
  writeFileSync(join(dir, c, '.gitkeep'), '');
}

writeFileSync(
  join(dir, 'project.md'),
  `---
title: ${name}
order: 50
draft: true # set to false when it's ready to go live
color: "#15130F" # brand colour
category: Branding · Social Media
year: "2026"
role: Graphic Designer
tagline: TODO — one sentence on what you made this brand feel like.
summary: TODO — what the company does and what you designed.
services: []
tools: []
stats: []
keywords: []
thinking: []
process: []
chapters:
${chapters.map((c) => `  - folder: ${c}`).join('\n')}
---
`,
);

console.log(`✔ Created projects/${slug}/ — drop designs into its folders, cover.jpg + logo.png at the top level.`);
