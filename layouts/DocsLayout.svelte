<script>
  import Sidebar from "@components/Sidebar";

  import { onMount } from "svelte";
  let active;
  export let top = 32;
  export let bottom = 32;
  export let left = 0;
  export let right = 0;
  export let snapType = 'proximity';
  let intersecting = false;
  let container;

  function handleHashChange() {
    active = location.hash.replace(/^#/, '')
  }

  onMount(() => {
    // setup hash & scroll position
    active = location.hash.replace(/^#/, '');
    if (active) {
      document.querySelector('article').style.scrollBehavior = 'auto'
      document.querySelector(location.hash).scrollIntoView()
      document.querySelector('article').style.scrollBehavior = 'smooth'
    }

    let first = true;
    if (typeof IntersectionObserver !== "undefined") {
      const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;

      const observer = new IntersectionObserver(
        entries => {
          if (first) {
            first = false;
          } else {
            entries.forEach(entry => {
              const id = entry.target.getAttribute("id");
              if (entry.intersectionRatio > 0) {
                window.location.hash = entry.target.id;
              }
            });
          }
        },
        {
          rootMargin
        }
      );
      [...container.children].forEach(el => observer.observe(el));
      return () => {
        return [...container.children].forEach(el => observer.unobserve(el));
      };
    }
  });
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    font-size: 16px;
    font-family: "Inter", sans-serif;
  }

  :global(html) {
    margin: 0;
    padding: 0;
  }

  :global(*) {
    box-sizing: border-box;
  }

  main {
    display: flex;
    width: 100%;
  }

  article {
    width: 100vw;
    position: relative;
    scroll-snap-type: y var(--snap-type, proximity);
    height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
</style>

<svelte:window on:hashchange={handleHashChange} />

<main>
  <Sidebar {active} />

  <article bind:this={container} style="--snap-type: {snapType}">
    <slot {intersecting} />
  </article>
</main>
