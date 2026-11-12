import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://aiagent.cardi.co.id',
  adapter: vercel(),
  integrations: [sitemap(), react()],
  redirects: {
    '/cardiloyal/card': '/loyal/card/',
    '/cardiloyal/card/': '/loyal/card/',
    '/loyal/card/affiliate.html': '/loyal/card/affiliate',
  },
});
