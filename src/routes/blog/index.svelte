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

<ul>
	{#each posts as post}
		<li>
			<a href={post.path}>
				<div class="article">
					<p class="title">{post.meta.title}</p>
					<p class="date">Published {post.meta.date}</p>
				</div>
			</a>
		</li>
	{/each}
</ul>

<style>
	.article {
		color: aqua;
	}
	.date {
		color: #fafafa;
	}
	li {
		margin-bottom: 3rem;
	}
</style>
