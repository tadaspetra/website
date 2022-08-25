<script>
	import Social from './Social.svelte';
</script>

<div>
	<div class="relative">
		<div class="flex flex-col items-center">
			<img class="md:w-3/4" src="profilepic.png" alt="tadas petra" />
		</div>
		<div
			class="absolute  text-white top-1/2 left-1/3 -translate-x-1/2 md:left-1/2 md:-translate-x-2/3 -translate-y-1/2"
		>
			<h1 class="text-white font-bold text-3xl md:text-6xl w-3/4 ">Hi, my name is Tadas</h1>
		</div>
	</div>
	<div class="tadas">
		<div>
			<p class="textspiel">
				My passion is learning about Tech, then sharing what I learn. The goal is to help people to
				find their own curiousities that inspire them to learn and create.
			</p>
			<div class="social">
				<p class="text">You can find me on:</p>
				<Social />
			</div>
		</div>
	</div>
</div>

<style>
	.main {
		font-size: 3rem;
		font-weight: bold;
		text-align: center;
		margin-top: 50px;
	}
	.tadas {
		display: flex;
		justify-content: center;
		margin-top: 50px;
	}
	.textspiel {
		font-size: 1.2rem;
		margin-top: 50px;
	}
	.headshot {
		width: 10rem;
		height: 10rem;
		border-radius: 1rem;
		margin: 10px 40px;
	}
	.social {
		display: flex;
	}
</style>
