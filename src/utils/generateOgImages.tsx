import type { CollectionEntry } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

const fontPath = join(
  process.cwd(),
  "public",
  "fonts",
  "LaBelleAurore-Regular.ttf"
);
const fontBuffer = readFileSync(fontPath);
const fontData = fontBuffer.buffer.slice(
  fontBuffer.byteOffset,
  fontBuffer.byteOffset + fontBuffer.byteLength
);

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "La Belle Aurore",
      data: fontData,
      weight: 400,
      style: "normal",
    },
  ],
};

async function svgBufferToPngBuffer(svg: string) {
  const { Resvg } = await import("@resvg/resvg-js");
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"posts">) {
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
