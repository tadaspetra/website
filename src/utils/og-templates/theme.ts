export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Inter Display: the optical size of Inter cut for large headlines.
// Tighter default spacing and finer details than the text cut.
export const OG_FONT_FAMILY = "Inter Display";

export const OG_COLORS = {
  ink: "#0a0a0a",
  // Flat, matching the site's bg-white. Subtle gradients band in 8-bit PNG.
  background: "#ffffff",
} as const;

export { smartenPunctuation } from "../typography";
