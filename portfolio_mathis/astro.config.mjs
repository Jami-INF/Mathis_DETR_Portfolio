// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mathis-detroussat.fr',
  vite: {
    plugins: [tailwindcss()],
  },
});