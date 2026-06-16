// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://jami-inf.github.io',
  base: '/Mathis_DETR_Portfolio',
  vite: {
    plugins: [tailwindcss()],
  },
});