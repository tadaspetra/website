<script>
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/style.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<a href="https://www.twitter.com/@tadaspetra" target="_blank">
		<img class="twitterlogo" src="/TwitterIcon.svg" alt="Twitter Logo" />
	</a>
	<a href="https://www.youtube.com/tadaspetra" target="_blank">
		<img class="youtubelogo" src="/YouTubeIcon.svg" alt="Youtube Logo" />
	</a>
</footer>

<style>
	footer {
		text-align: center;
		padding: 3rem;
		margin-top: 100px;
	}
	.twitterlogo {
		width: 50px;
		height: 50px;
		margin: 0 10px;
		opacity: 0.5;
	}
	.twitterlogo:hover {
		opacity: 1;
	}
	.youtubelogo {
		width: 50px;
		height: 50px;
		margin: 0 10px;
		opacity: 0.5;
	}
	.youtubelogo:hover {
		opacity: 1;
	}
</style>
