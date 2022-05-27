<script>
	import Social from './Social.svelte';
</script>

<div>
	<h1 class="main">Hi, my name is Tadas</h1>
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
		<img class="headshot" src="profilepic.png" alt="tadas petra" />
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
		font-size: 1rem;
	}
</style>
