// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL / BASE_PATH are filled in automatically by the GitHub Pages workflow
// (.github/workflows/deploy.yml). Locally the site runs at http://localhost:4321/.
export default defineConfig({
  site: process.env.SITE_URL || 'https://yvy0405.github.io',
  base: process.env.BASE_PATH || '/',
  devToolbar: { enabled: false },
  image: {
    // Designers export huge PNGs — allow big canvases (e.g. 1400×15000 Behance boards).
    service: { entrypoint: 'astro/assets/services/sharp', config: { limitInputPixels: false } },
  },
});
