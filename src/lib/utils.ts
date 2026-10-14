import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Prefix internal links with the deploy base path (needed on GitHub Pages project sites). */
export function url(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Drafts are visible while working locally (npm run dev) and hidden on the live site. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', (p) => import.meta.env.DEV || !p.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** Readable text colour on top of a brand colour (whichever of ink/paper has more contrast). */
export function onColor(hex: string) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.18 ? '#15130F' : '#F6F2EA';
}

export const pad = (n: number) => String(n).padStart(2, '0');
