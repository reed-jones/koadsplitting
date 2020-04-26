<script>
	let name = '';
</script>

<main>
	<nav>
		<a href="/">Home</a>
		<a href="/great">Great</a>
		<a href="/test/neat">Neat!</a>
	</nav>

	<h1>Hello. this is http://localhost:3000/great</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		color: blue;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
