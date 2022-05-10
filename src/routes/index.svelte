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
	export let posts;
	function goToBlog() {
		window.location.href = '/blog';
	}
</script>

<p class="disclaimer">
	By the way, I know this website looks like 💩, but I wanted to release asap and I built it with
	Svelte which I am brand new to. It will get better in time :)
</p>
<h1>Recent Blogs</h1>
<Blogs {posts} />
<button class="button" on:click={goToBlog}>All Blogs</button>

<style>
	.disclaimer {
		background-color: #ffcdc9;
		padding: 1rem;
		border-radius: 1rem;
		font-weight: 600;
	}
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
</style>
