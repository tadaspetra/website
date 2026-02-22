import type { CollectionEntry } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

// Read profile image and convert to base64
const imagePath = join(process.cwd(), "public", "profile-white.png");
const imageBuffer = readFileSync(imagePath);
const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

async function fetchGoogleFont(
  family: string,
  weight: number
): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;
  const cssResponse = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
    },
  });
  const css = await cssResponse.text();
  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Could not find font URL for ${family} weight ${weight}`);
  }
  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
}

let _options: SatoriOptions | null = null;

async function getOptions(): Promise<SatoriOptions> {
  if (_options) return _options;
  const fontData = await fetchGoogleFont("Fraunces", 700);
  _options = {
    width: 1200,
    height: 630,
    embedFont: true,
    fonts: [
      {
        name: "Fraunces",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  };
  return _options;
}

async function svgBufferToPngBuffer(svg: string) {
  const { Resvg } = await import("@resvg/resvg-js");
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"essays">) {
  const options = await getOptions();
  const svg = await satori(postOgImage(post, imageBase64), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const options = await getOptions();
  const svg = await satori(siteOgImage(imageBase64), options);
  return svgBufferToPngBuffer(svg);
}
