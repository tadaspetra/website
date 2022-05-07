<script>
	export let title;
	export let date;
	export let tags;
</script>

<h1>{title}</h1>

<p><b>{tags}</b> - {date}</p>

<slot />

<style>
	h1 {
		padding-top: 2rem;
	}
</style>
