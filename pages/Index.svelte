<script>
	import NavBar from '../components/NavBar.svelte'
	let count = 0;

	function handleClick() {
		count += 1;
	}

	export let name;
</script>


<svelte:head>
	<title>Hello World</title>
	<meta name="robots" content="noindex nofollow" />
	<html lang="en" />
</svelte:head>

<main>
	<NavBar />

	<h1>Hello {name}</h1>
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
		color: red;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
