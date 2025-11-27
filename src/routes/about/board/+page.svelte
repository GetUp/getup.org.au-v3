<script>
  import BoardSection from "$lib/components/board-section.svelte";
</script>

<svelte:head>
  <title>Board - GetUp</title>
  <meta
    name="description"
    content="Meet the GetUp Board guiding our governance, accountability, and strategy."
  />
</svelte:head>

<section class="space-y-6">
  <div class="space-y-3">
    <p class="text-sm font-semibold uppercase text-gray-500">Governance</p>
    <h1 class="text-4xl font-display leading-tight">Our Board</h1>
    <p class="text-lg text-gray-700 max-w-3xl">
      A diverse group of leaders in advocacy, law, finance, and community organising who steward
      our independence and accountability.
    </p>
  </div>

  <BoardSection />
</section>
