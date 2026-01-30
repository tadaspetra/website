// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://tadaspetra.com",
  integrations: [
    react(),
    expressiveCode({
      themes: ["catppuccin-latte", "catppuccin-mocha"],
      themeCssSelector: (theme) =>
        theme.name === "catppuccin-mocha" ? ".dark" : ":not(.dark)",
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
      styleOverrides: {
        codeBackground: "transparent",
        borderWidth: "0px",
        borderColor: "transparent",
        frames: {
          shadowColor: "transparent",
          editorActiveTabBackground: "transparent",
          editorActiveTabForeground: "#737373",
          editorTabBarBackground: "transparent",
        },
        lineNumbers: {
          foreground: "#737373",
        },
      },
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    maxDuration: 60,
  }),
});
