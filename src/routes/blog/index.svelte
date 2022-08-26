<script context="module">
	export const load = async ({ fetch }) => {
		const posts = await fetch('/api/allblogs.json');
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
	function loadMore() {
		posts = posts.concat(posts);
	}
</script>

<h1 class="text-2xl font-medium">All Blogs</h1>
<Blogs {posts} />
<button on:click={loadMore} class="mt-5 text-lg duration-200 transition-all hover:opacity-80">
	Load more
</button>
