import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

export default {
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
};
