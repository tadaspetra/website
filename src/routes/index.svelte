<script context="module">
	export const load = async ({ fetch }) => {
		const posts = await fetch('/api/threeblogs.json');
		const allPosts = await posts.json();

		return {
			props: {
				posts: allPosts
			}
		};
	};
</script>

<script>
	import Blogs from '$lib/components/Blogs.svelte';
	import Intro from '$lib/components/Intro.svelte';
	export let posts;
</script>

<Intro />
<h2 class="mt-16 md:mt-36 text-2xl font-medium">Recent blogs</h2>
<Blogs {posts} />

<div class="mt-5">
	<a href="/blog" class="text-lg flex items-center hover:underline">
		view all blogs
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-4 h-4 ml-1"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
			/>
		</svg>
	</a>
</div>
