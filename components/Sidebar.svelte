<script>
  import Link from "./Link";
  export let active;
  export let open = false;

  function toggleNav() {
    open = !open;
    console.log(`nav is now ${open ? "Open" : "Closed"}`);
  }
</script>

<style>
  nav {
    width: 80vw;
    background: #4c597b;
    top: 0;
    height: 100vh;
    display: flex;
    flex-flow: row wrap;
    transform: translateX(-95%);
    position: absolute;
    transition: 0.3s;
    z-index: 10;
  }
  nav.open {
    transform: translateX(0px);
  }

  @media screen and (min-width: 768px) {
    nav {
      width: 40vw;
      transform: translateX(0%);
      position: sticky;
    }
  }
  ul {
    margin: 0;
    list-style-type: none;
    display: flex;
    flex-flow: row wrap;
  }

  li {
    width: 100%;
    text-align: right;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-end;
  }

  a {
    width: 100%;
    padding: 1rem 2rem;
    text-decoration: none;
    color: white;
  }

  .home {
    text-decoration: underline;
    padding: 3rem 2rem;
    font-size: 1.5rem;
  }

  .mobile-toggle {
    width: 10vw;
    height: 10vw;
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateX(10vw);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    padding: .25rem;
    border-top-right-radius: .25rem;
    border-right-width: 2px;
    border-top-width: 2px;
    border-left-width: 0;
    border-bottom-width: 0;
    border-style: solid;
    border-color: #4c597b;
    background: #4c597b;
    color: white;
  }
  .mobile-toggle:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -.25rem;
      width: .5rem;
      background: #4c597b;
      z-index: -10;
  }

  .mobile-toggle span {
      border: 1px solid;
      width: 80%;
  }

  @media screen and (min-width: 768px) {
      .mobile-toggle {
          display: none;
      }
  }
  ul {
    height: 100vh;
    overflow-y: scroll;
  }
</style>

<nav class:open>
  <ul>
    <li>
      <a href="/" class="home">Home</a>
    </li>
    <li>
      <Link href="/docs/" {active} hash="" main>Quick Start</Link>
    </li>
    <li>
      <Link href="/docs/" {active} hash="setup">Setup</Link>
    </li>
    <li>
      <Link href="/docs/" {active} hash="usage">Usage</Link>
    </li>
    <li>
      <Link href="/docs/advanced/" {active} hash="" main>Advanced</Link>
    </li>
    <li>
      <Link href="/docs/advanced/" {active} hash="cli-options">CLI Options</Link>
    </li>
    <li>
      <Link href="/docs/advanced/" {active} hash="configuration">
        Configuration
      </Link>
    </li>
    <li>
      <Link href="/docs/advanced/" {active} hash="routing">Routing</Link>
    </li>
    <li>
      <Link href="/docs/advanced/" {active} hash="programmatic-usage">
        Programmatic Usage
      </Link>
    </li>
  </ul>
  <div on:click={() => (open = !open)} class="mobile-toggle">
    <span />
  <span />
  <span />
  </div>
</nav>
