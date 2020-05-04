<script>
  import Link from "./Link";
  export let active;
</script>

<style>
  nav {
    flex: 0.4;
    background: #4c597b;
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-flow: row wrap;
    overflow-y: auto;
  }

  a {
    width: 100%;
    padding: 1rem 2rem;
    text-align: right;
    text-decoration: none;
    color: white;
  }

  .home {
    text-decoration: underline;
    padding: 3rem 2rem;
    font-size: 1.5rem;
  }
</style>

<nav>
  <a href="/" class="home">Home</a>
  <Link href="/docs/" {active} hash="" main>Quick Start</Link>
  <Link href="/docs/" {active} hash="setup">Setup</Link>
  <Link href="/docs/" {active} hash="usage">Usage</Link>

  <Link href="/docs/advanced" {active} hash="" main>Advanced</Link>
  <Link href="/docs/advanced" {active} hash="cli-options">CLI Options</Link>
  <Link href="/docs/advanced" {active} hash="configuration">Configuration</Link>
  <Link href="/docs/advanced" {active} hash="routing">Routing</Link>
  <Link href="/docs/advanced" {active} hash="programmatic-usage">
    Programmatic Usage
  </Link>
</nav>
