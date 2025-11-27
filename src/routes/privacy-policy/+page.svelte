<script>
  import Accordion from "$lib/components/accordion.svelte";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.heading} - GetUp</title>
</svelte:head>

<main class="v2-basic space-y-8">
  <h1>{data.heading}</h1>

  <div>
    {@html data.body}
  </div>

  <div class="space-y-2">
    {#each data.sections as section}
      <Accordion title={section.heading}>
        <div>
          {@html section.body}
        </div>
      </Accordion>
    {/each}
  </div>
</main>
