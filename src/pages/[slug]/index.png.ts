import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "../../utils/generateOgImages";

export async function getStaticPaths() {
  const essays = await getCollection("posts", ({ id, data }) =>
    id.startsWith("essays/") && !data.draft
  );

  return essays.map(post => {
    // essays/how-computers-work/index.mdx -> how-computers-work
    const slug = post.id.split("/")[1];
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
