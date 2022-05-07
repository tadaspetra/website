<script context="module">
	export const load = async ({ fetch }) => {
		const posts = await fetch('/api/posts.json');
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
	export let posts;
</script>

<p class="disclaimer">
	By the way, I know this website looks like 💩, but I wanted to release asap and I built it with
	Svelte in 2 days which I am brand new to. It will get better in time :)
</p>
<Blogs {posts} />

<style>
	.disclaimer {
		background-color: #ffcdc9;
		padding: 1rem;
		border-radius: 1rem;
		font-weight: 600;
	}
</style>
