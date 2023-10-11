import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/static";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  markdown: {
    // Example: Switch to use prism for syntax highlighting in Markdown
    syntaxHighlight: 'shiki'
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});