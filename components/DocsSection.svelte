<script>
  export let id = "";
</script>

<style>
  section {
    min-height: 105vh;
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: start;
    padding: 6rem 4rem;
  }
</style>

<section {id}>
  <slot />
</section>
