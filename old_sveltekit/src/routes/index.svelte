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
	function goToBlog() {
		window.location.href = '/blog';
	}
</script>

<Intro />
<h1>Recent Blogs</h1>
<Blogs {posts} />
<button class="button" on:click={goToBlog}>All Blogs</button>

<style>
	.button {
		background-color: #606060;
		border: none;
		color: white;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		margin: 0px 25% 0px 25%;
		font-size: 16px;
		border-radius: 1rem;
		width: 50%;
	}
	.button:hover {
		background-color: #212121;
	}
	h1 {
		margin-top: 5rem;
	}
</style>
