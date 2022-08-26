<script>
	export let posts;
</script>

<div class="mt-10 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
	{#each posts as post}
		<a href={post.path}>
			<div class="bg-[#f5f4f4] rounded h-full duration-200 transition-all hover:opacity-80">
				<img class="rounded-t" src={post.meta.image} alt="Image for ${post.meta.title}" />
				<div class="px-3 py-5 flex flex-col">
					<p class="mb-3">{new Date(post.meta.date).toDateString()}</p>
					<p class="text-xl font-medium">{post.meta.title}</p>
				</div>
			</div>
		</a>
	{/each}
</div>
