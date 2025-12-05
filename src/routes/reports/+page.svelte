<script>
  import TransparencySection from "$lib/components/transparency-section.svelte";
  import { researchReportsContent } from "$lib/data/content";
</script>

<svelte:head>
  <title>Research Reports - GetUp</title>
  <meta
    name="description"
    content="View GetUp's annual reports and financial transparency documents."
  />
</svelte:head>

<TransparencySection content={researchReportsContent} />
