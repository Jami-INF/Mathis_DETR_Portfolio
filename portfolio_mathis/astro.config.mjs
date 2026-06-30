// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mathis-detroussat.fr',
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/mentions-legales"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});