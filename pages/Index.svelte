<style>
:global(html) {
    margin: 0;
    width: 100vw;
    font-size: 16px;
}
  :global(body) {
    margin: 0;
    width: 100vw;
    font-size: 16px;
    font-family: "Inter", sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  main {
    width: 100vw;
    text-align: center;
    /* padding: 25vh 4rem; */
    color: #444;
    /* border: 1px solid; */
    height: 100vh;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
  }
  .row {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
  }
  h1 {
    font-size: 6rem;
    margin: 0;
  }
  span {
    font-size: 3rem;
  }

  .docs-link {
    text-decoration: none;
    background: #3c528b;
    color: white;
    border-radius: 0.4rem;
    padding: 0.5rem 1rem;
  }
</style>

<main>
  <header class="bg-red-500">
    <div class="row">
      <h1>
        SVELTE
        <wbr />
        <span>Server</span>
      </h1>
      <p>(Unofficial)</p>
    </div>
    <a href="/docs/#" class="docs-link">Read The Docs</a>
  </header>
</main>
