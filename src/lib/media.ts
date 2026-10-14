import type { ImageMetadata } from 'astro';

/**
 * Picks up every design dropped into /projects/<slug>/… automatically.
 *
 *   projects/<slug>/cover.jpg            → hero + card image
 *   projects/<slug>/logo.svg|png         → client logo
 *   projects/<slug>/<chapter>/…          → one chapter of the case study per sub-folder
 *   projects/<slug>/*.jpg (loose files)  → an extra "More work" chapter
 *
 * Anything whose file or folder name starts with "_" is ignored (keep WIP there).
 */

export type MediaItem =
  | { kind: 'image'; path: string; name: string; image: ImageMetadata }
  | { kind: 'file'; path: string; name: string; src: string } // svg / gif — served as-is
  | { kind: 'video'; path: string; name: string; src: string };

export interface ProjectMedia {
  cover?: MediaItem;
  logo?: MediaItem;
  loose: MediaItem[];
  chapters: Map<string, MediaItem[]>;
}

const rasters = import.meta.glob<{ default: ImageMetadata }>(
  '/projects/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}',
  { eager: true },
);
const files = import.meta.glob<string>('/projects/**/*.{svg,gif,SVG,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const videos = import.meta.glob<string>('/projects/**/*.{mp4,webm,MP4,WEBM}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

function baseName(path: string) {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.[^.]+$/, '');
}

const all: MediaItem[] = [
  ...Object.entries(rasters).map(([path, mod]) => ({
    kind: 'image' as const,
    path,
    name: baseName(path),
    image: mod.default,
  })),
  ...Object.entries(files).map(([path, src]) => ({ kind: 'file' as const, path, name: baseName(path), src })),
  ...Object.entries(videos).map(([path, src]) => ({ kind: 'video' as const, path, name: baseName(path), src })),
]
  .filter((m) => !m.path.split('/').some((part) => part.startsWith('_')))
  .sort((a, b) => collator.compare(a.path, b.path));

const cache = new Map<string, ProjectMedia>();

export function getProjectMedia(slug: string): ProjectMedia {
  const hit = cache.get(slug);
  if (hit) return hit;

  const media: ProjectMedia = { loose: [], chapters: new Map() };
  const prefix = `/projects/${slug}/`;

  for (const item of all) {
    if (!item.path.startsWith(prefix)) continue;
    const rest = item.path.slice(prefix.length).split('/');
    if (rest.length === 1) {
      const key = item.name.toLowerCase();
      if (key === 'cover' && item.kind !== 'video') media.cover ??= item;
      else if (key === 'logo' && item.kind !== 'video') media.logo ??= item;
      else media.loose.push(item);
    } else {
      const folder = rest[0];
      if (!media.chapters.has(folder)) media.chapters.set(folder, []);
      media.chapters.get(folder)!.push(item);
    }
  }

  cache.set(slug, media);
  return media;
}

/** Folders in /projects/<slug>/ that exist on disk (including empty ones) — used for dev placeholders. */
const keepFiles = import.meta.glob('/projects/*/*/.gitkeep', { query: '?raw', import: 'default' });
export function getChapterFolders(slug: string): string[] {
  const prefix = `/projects/${slug}/`;
  const folders = new Set<string>();
  for (const p of Object.keys(keepFiles)) if (p.startsWith(prefix)) folders.add(p.slice(prefix.length).split('/')[0]);
  for (const f of getProjectMedia(slug).chapters.keys()) folders.add(f);
  return [...folders].filter((f) => !f.startsWith('_')).sort(collator.compare);
}

export function ratio(item: MediaItem): number | undefined {
  return item.kind === 'image' ? item.image.width / item.image.height : undefined;
}

/** Pick a sensible layout when project.md doesn't say. */
export function autoLayout(items: MediaItem[]) {
  const ratios = items.map(ratio).filter((r): r is number => r !== undefined);
  if (!ratios.length) return items.length > 1 ? 'duo' : 'wide';
  const social = ratios.filter((r) => r >= 0.74 && r <= 1.02).length / ratios.length;
  const landscape = ratios.filter((r) => r > 1.25).length / ratios.length;
  if (social > 0.7 && items.length >= 6) return 'feed';
  if (landscape > 0.7) return items.length <= 2 ? 'wide' : 'duo';
  if (items.length === 1) return 'wide';
  if (items.length <= 3) return 'trio';
  return 'masonry';
}

/** "01-monthly-content" → "Monthly Content" */
export function prettify(name: string) {
  return name
    .replace(/^[\d\s._-]+/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** "before", "after-v2", "01_before" → label */
export function compareLabel(name: string) {
  const m = name.match(/(?:^|[-_\s])(before|after|old|new)(?:[-_\s]|$)/i);
  if (!m) return undefined;
  const k = m[1].toLowerCase();
  return k === 'before' || k === 'old' ? 'Before' : 'After';
}
