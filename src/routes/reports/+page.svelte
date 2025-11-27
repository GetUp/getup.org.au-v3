<script>
  import TransparencySection from '$lib/components/transparency-section.svelte';
  import { reportsContent } from '$lib/data/content';
</script>

<svelte:head>
  <title>Annual Reports - GetUp</title>
  <meta name="description" content="View GetUp's annual reports and financial transparency documents." />
</svelte:head>

<main class="container mx-auto px-4 py-12 max-w-7xl">
  <TransparencySection content={reportsContent} />
</main>
