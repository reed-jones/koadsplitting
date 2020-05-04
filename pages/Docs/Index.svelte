<script>
  import DocsLayout from "@layouts/DocsLayout";

  import DocsSection from "@components/DocsSection";
  import CodeBlock from "@components/CodeBlock";
</script>

<DocsLayout>

  <DocsSection id="setup">
    <CodeBlock>npx svelte-server --init</CodeBlock>
  </DocsSection>

  <DocsSection id="usage">
    <CodeBlock>npx svelte-server</CodeBlock>
  </DocsSection>

  <DocsSection id="enjoy">
    <CodeBlock>Enjoy!</CodeBlock>
  </DocsSection>

</DocsLayout>
