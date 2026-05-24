// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://personal-site.foreverfree90504.workers.dev',
  integrations: [mdx(), sitemap()],

  fonts: [
      {
          provider: fontProviders.google(),
          name: 'Source Serif 4',
          cssVariable: '--font-source-serif',
          fallbacks: ['Georgia', 'serif'],
          weights: [400, 600, 700],
          styles: ['normal', 'italic'],
          subsets: ['latin'],
      },
      {
          provider: fontProviders.google(),
          name: 'Playfair Display',
          cssVariable: '--font-playfair',
          fallbacks: ['Georgia', 'serif'],
          weights: [400, 700, 900],
          styles: ['normal', 'italic'],
          subsets: ['latin'],
      },
      {
          provider: fontProviders.google(),
          name: 'Noto Serif TC',
          cssVariable: '--font-noto-serif-tc',
          fallbacks: ['serif'],
          weights: [400, 500, 700],
          subsets: ['latin'],
      },
	],

  vite: {
      plugins: [tailwindcss()],
	},

  adapter: cloudflare(),
});