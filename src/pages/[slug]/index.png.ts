import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "../../utils/generateOgImages";

export async function getStaticPaths() {
  const posts = await getCollection("posts").then(p =>
    p.filter(({ data }) => !data.draft)
  );

  return posts.map(post => {
    // Handle both flat files (2024/post-name.md) and folder-based (essays/how-computers-work/index.mdx)
    const parts = post.id.split("/");
    const filename = parts.pop() ?? "";
    // Remove .md or .mdx extension
    const basename = filename.replace(/\.mdx?$/, "");
    // If basename is "index", use the parent folder name as slug
    const slug = basename === "index" ? parts.pop() ?? post.id : basename;
    return {
      params: { slug },
      props: post,
    };
  });
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForPost(props as CollectionEntry<"posts">), {
    headers: { "Content-Type": "image/png" },
  });
