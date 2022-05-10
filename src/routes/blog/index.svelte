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

<h1>All Blogs</h1>
<Blogs {posts} />
<!--<button class="button" on:click={loadMore}>Load more</button>-->
