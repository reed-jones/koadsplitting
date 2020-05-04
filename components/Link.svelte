<script>
export let href;
export let hash = '';
export let active = '';
export let main = false;

const isActive = active === hash

const to = `${href}#${hash}`
</script>

<style>
  a {
    width: 100%;
    padding: 1rem 2rem;
    text-align: right;
    text-decoration: none;
    color: white;
  }

  .main {
      text-decoration: underline;
  }

  .sub-nav {
      opacity: 0.5;
  }

  .active {
      font-style: italic;
      opacity: 0.65;
      text-decoration: underline;
  }
</style>

<a href={to} class:active={active === hash} class={main ? 'main' : 'sub-nav'}><slot /></a>
