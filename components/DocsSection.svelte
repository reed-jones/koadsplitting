<script>
  export let id = "";
</script>

<style>
  section {
    min-height: 100vh;
    max-width: 768px;
    margin: 4rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: start;
    padding: 20vw 10vw;
  }
  @media screen and (min-width: 768px) {
    section {
      min-height: 105vh;
      padding: 6rem 4rem;
    }
  }
</style>

<section {id}>
  <slot />
</section>
