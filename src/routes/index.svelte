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
	export let posts;
</script>

<p class="disclaimer">
	By the way, I know this website looks like 💩, but I wanted to release asap and I built it with
	Svelte in 2 days which I am brand new to. It will get better in time :)
</p>
<ul>
	{#each posts as post}
		<li>
			<h2>
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h2>
			Published {post.meta.date}
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 3rem 0;
		list-style-type: none;
		gap: 1rem;
	}
	.disclaimer {
		background-color: #ffcdc9;
		padding: 1rem;
		border-radius: 1rem;
		font-weight: 600;
	}
</style>
