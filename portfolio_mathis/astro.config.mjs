// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://mathis-detroussat.fr',
  integrations: [sitemap({
    filter: (page) => !page.includes("/mentions-legales"),
  }), preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});