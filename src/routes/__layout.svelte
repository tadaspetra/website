<script>
	import Header from '$lib/components/Header.svelte';
	import Social from '$lib/components/Social.svelte';
	import '$lib/styles/style.css';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<Social />
</footer>

<style>
	footer {
		text-align: center;
		padding: 3rem;
		margin-top: 100px;
	}
</style>
