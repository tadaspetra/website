<script>
	export let posts;
</script>

<ul>
	{#each posts as post}
		<li>
			<a href={post.path}>
				<div class="headimage">
					<img src={post.meta.image} alt="Image for ${post.meta.title}" />
				</div>
				<div class="titlesection">
					<p class="title">{post.meta.title}</p>
					<p class="date">{new Date(post.meta.date).toDateString()}</p>
				</div>
			</a>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding-inline-start: 0;
	}
	li {
		margin-bottom: 3rem;
		list-style-type: none;
	}
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
	}
	a:hover {
		margin: -0.5rem 0rem 3.5rem 0rem;
	}
	.title {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		text-decoration: none;
	}
	.headimage {
		max-width: 40%;
		max-height: fit-content;
	}
	img {
		border-radius: 1rem;
	}
	.titlesection {
		padding: 0 0 0 1rem;
	}
</style>
