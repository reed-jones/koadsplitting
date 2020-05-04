<script>
  import Sidebar from "@components/Sidebar";

  import { onMount } from "svelte";
  let active;
  export let top = 32;
  export let bottom = 32;
  export let left = 0;
  export let right = 0;
  let intersecting = false;
  let container;

  onMount(() => {
    active = container.children[0];
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
                active = entry.target.id;
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
    flex: 1;
    scroll-snap-type: y proximity;
    height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
</style>

<main>
  <Sidebar {active} />

  <article bind:this={container}>
    <slot {intersecting} />
  </article>
</main>
