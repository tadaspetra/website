// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import expressiveCode from "astro-expressive-code";
import mermaid from "astro-mermaid";
import mdx from "@astrojs/mdx";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://tadaspetra.com",
  redirects: {
    "/how-computers-work": {
      status: 301,
      destination: "/how-the-computer-works",
    },
  },
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
    mermaid({
      theme: "base",
      autoTheme: true,
      enableLog: false,
      mermaidConfig: {
        themeVariables: {
          background: "transparent",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          primaryColor: "#ffffff",
          primaryTextColor: "#262626",
          primaryBorderColor: "#d4d4d4",
          lineColor: "#a3a3a3",
          tertiaryColor: "#fafafa",
        },
        flowchart: {
          curve: "basis",
          htmlLabels: true,
          nodeSpacing: 64,
          rankSpacing: 56,
          padding: 24,
        },
        markdownAutoWrap: true,
      },
    }),
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
