import type { CollectionEntry } from "astro:content";
import satori, { type SatoriOptions } from "satori";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import { OG_FONT_FAMILY, OG_HEIGHT, OG_WIDTH } from "./og-templates/theme";

// Output scale. Social platforms downsample anyway, but rendering at 2x keeps
// glyph edges crisp on high-DPI previews (Slack, iMessage, X, LinkedIn).
const OUTPUT_SCALE = 2;

const assetsDir = join(process.cwd(), "src", "assets");
const fontMedium = readFileSync(join(assetsDir, "InterDisplay-Medium.woff"));
const fontSemiBold = readFileSync(join(assetsDir, "InterDisplay-SemiBold.woff"));

let _options: SatoriOptions | null = null;

async function getOptions(): Promise<SatoriOptions> {
  if (_options) return _options;
  _options = {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    embedFont: true,
    fonts: [
      {
        name: OG_FONT_FAMILY,
        data: fontMedium,
        weight: 500,
        style: "normal",
      },
      {
        name: OG_FONT_FAMILY,
        data: fontSemiBold,
        weight: 600,
        style: "normal",
      },
    ],
  };
  return _options;
}

async function svgBufferToPngBuffer(svg: string) {
  const { Resvg } = await import("@resvg/resvg-js");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_WIDTH * OUTPUT_SCALE },
    // Text is embedded as paths, so shape rendering is what matters here.
    shapeRendering: 2, // geometricPrecision
    textRendering: 2, // geometricPrecision
    imageRendering: 0, // optimizeQuality
    font: { loadSystemFonts: false },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"essays">) {
  const options = await getOptions();
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const options = await getOptions();
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
