<script>
	import '../app.css';
import Button from './button.svelte';
</script>
<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
<nav>
	<ul>
		<li><a href="/">StairWELL</a></li>
		<li><a href="/projection">Projection</a></li>
		<li><a href="/about">About</a></li>
	</ul>
</nav>

<slot />


<style>
	@import url('https://fonts.googleapis.com/css2?family=Gantari:wght@300;400;700');

	:root {
		--color-one: #555B6E;
		--color-two: #89B0AE;
		--color-three: #BEE3DB;
		--color-four: #FAF9F9;
		--color-five: #FFD6BA;
	}
	
	nav {
		background-color: var(--color-two);
		width: 100vw;
		padding: 1rem;
	}

	ul {
		display: flex;
		justify-content: space-around;
	}

	li {
		color: var(--color-five);
		font-family: 'Gantari', cursive;
		text-shadow: #555B6E 0.1rem 0.1rem;
		font-weight: 700;
		font-size: 5vw;
	}
</style>
