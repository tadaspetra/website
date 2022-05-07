<script>
	export let posts;
</script>

<ul>
	{#each posts as post}
		<li>
			<a href={post.path}>
				<p class="title">{post.meta.title}</p>
				<p class="date">{new Date(post.meta.date).toDateString()}</p>
			</a>
		</li>
	{/each}
</ul>

<style>
	li {
		margin-bottom: 3rem;
		list-style-type: none;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
	.title {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		text-decoration: none;
	}
</style>
