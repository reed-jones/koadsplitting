<script>
  import DocsLayout from "@layouts/DocsLayout";

  import DocsSection from "@components/DocsSection";
  import CodeBlock from "@components/CodeBlock";
</script>

<style>
  :global(#configuration code) {
    font-size: 1rem;
  }

  :global(#cli-options code) {
    font-size: 1rem;
  }

  :global(#routing code) {
    font-size: 1rem;
  }

  :global(#programmatic-usage code) {
    font-size: 1rem;
  }

  .content {
    max-width: 600px;
  }
</style>

<DocsLayout>

  <DocsSection id="cli-options">
    <div class="content">
      <h1>CLI</h1>
      <p>
        Most settings available in
        <a href="/docs/advanced/#configuration">Configuration</a>
        are also available as CLI options. Below are the available flags
      </p>
      <p>
        <CodeBlock>--dev</CodeBlock>
        <CodeBlock>--hmr</CodeBlock>
        <CodeBlock>--public</CodeBlock>
        <CodeBlock>--pages</CodeBlock>
        <CodeBlock>--template</CodeBlock>
        <CodeBlock>--watch</CodeBlock>
        <CodeBlock>--alias</CodeBlock>
      </p>
    </div>
  </DocsSection>

  <DocsSection id="configuration">
    <div class="content">
      <h1>Configuration</h1>

      <p>
        The easiest way to configure svelte-server is by adding a 'setup.js'
        file in the root of your project. This will export the configuration
        object to be consumed by svelte-server.
      </p>

      <CodeBlock>
        {`module.exports = {
  // config...
}`}
      </CodeBlock>

      <p>
        Within this there are two main keys, `props`, and `config`. The props
        key is used to provide the initial props to the root component. This is
        useful for a few reasons, but primarily for loading data from your
        database, files on disk, or external API.
      </p>

      <CodeBlock>
        {`const github = endpoint => {
  return axios.get(\`https://api.github.com/\`\${endpoint})
}

module.exports = {
  props: {
    '/': async () => {
      return {
        appName: 'Svelte Server',
        changelog: require('fs').readFileSync('./CHANGELOG.md', 'utf-8'),
        releases: await github('repos/reed-jones/svelte-server/releases')
      }
    },
  }
}`}
      </CodeBlock>

      <p>
        If the route is dynamic
        <a href="/docs/advanced/#routing">(See Routing)</a>
        , its dynamic properties will be passed in as arguments into the
        accepting props function.
      </p>

      <CodeBlock>
        {`module.exports = {
  props: {
    '/posts/:post': ({ post }) => {
      // fetchs data related to post...
      return { post }
    },
  }
}`}
      </CodeBlock>

      <p>
        The other section in setup.js is `config`. This is where various server
        specific settings are configured
      </p>
      <CodeBlock>
        {`module.exports = {
  config: {
    // path to static public assets
    public: "./public",

    // pages for filesystem based routing
    pages: "./pages",

    // chokidar watch locations (just looks for svelte files)
    watch: ["./pages", "./components", "./layouts"],

    // main page template: uses [ejs](https://ejs.co/)
    template: "index.template.ejs",

    // import aliases
    alias: {
      "@components": "./components",
      "@layouts": "./layouts",
      "@pages": "./pages",
    },
  }
}`}
      </CodeBlock>
    </div>
  </DocsSection>

  <DocsSection id="routing">
    <div class="content">
      <h1>Routing</h1>
      <p>
        Routing with Svelte Server is entirely file system based. First a base
        directory is chosen. By default this is `./pages` but can be configured
        to be anything. From there the url is derived by the kebab-case path the
        the file. `Index.svelte` files will behave much as you would expect
        index.html files to.
      </p>

      <p>
        Routes requiring dynamic pathing can be specified by wrapping the name
        in square brackets. The caveat here is that `.svelte` files cannot currently
        be named in this fashion. To work around this, a directory can be named
        dynamically, and within an Index.svelte file can be placed.
      </p>
      <h2>Examples</h2>
      <CodeBlock>
//  pages/Index.svelte
    => /

//  pages/SomethingInteresting.svelte
    => /something-interesting

//  pages/Posts/[Post]/Index.svelte
    => /posts/:post

//  pages/Posts/[Post]/Details.svelte
    => /posts/:post/details

</CodeBlock>
    </div>
  </DocsSection>

  <DocsSection id="programmatic-usage">
    <div class="content">
      <h1>Programmatic Usage</h1>
      <p>
        Programmatic usage is available, and has a very simple api.
      </p>
      <CodeBlock>
      {`import svelteServer from "svelte-server";

svelteServer
  .config({ /* options */ })
  .listen();`}
      </CodeBlock>

      <p>
        In the above example, if no options are provided, then all the defaults will be used
        see: <a href="/docs/advanced/#configuration">Configuration</a>.
        The format can match exactly what `setup.js` would be (even importing it directly if you choose)
        or can be just the `config` key from setup.
      </p>
    </div>
  </DocsSection>

</DocsLayout>
