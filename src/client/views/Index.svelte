<script>
	let count = 0;

	function handleClick() {
		count += 1;
	}

	let name = 'world';
</script>

<main>
	<nav>
		<a href="/">Home</a>
		<a href="/great">Great</a>
		<a href="/test/neat">Neat!</a>
	</nav>

	<h1>Hello {name}! This IS Cool</h1>
	<button on:click={handleClick}>
		Clicked {count} {count === 1 ? 'time' : 'times'}
	</button>
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
		color: #ff3e00;
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
