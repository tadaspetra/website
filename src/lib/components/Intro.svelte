<script>
	import Social from './Social.svelte';
</script>

<div class="flex flex-col-reverse mt-10 md:mt-32 md:flex-row md:items-center mb-5">
	<div>
		<h1 class="text-4xl lg:text-5xl font-bold">Hi, my name is Tadas 👋</h1>
		<p class="mt-5 lg:mt-10 text-2xl lg:text-3xl">
			My passion is learning about Tech, then sharing what I learn. The goal is to help people to
			find their own curiousities that inspire them to learn and create.
		</p>
		<div class="mt-5 lg:mt-10">
			<Social />
		</div>
	</div>
	<img
		class="rounded w-full md:w-72 lg:w-80 mb-10 md:mb-0  md:ml-5"
		src="/profilepic.png"
		alt="Tadas Petra"
	/>
</div>
