<script lang="ts">
  import DonationSnapshot from "$lib/components/donation-snapshot.svelte";
</script>

<svelte:head>
  <title>Donation Snapshot - GetUp</title>
  <meta
    name="description"
    content="Live donation statistics for GetUp's movement."
  />
</svelte:head>

<main class="max-w-5xl mx-auto px-4 md:px-6 lg:px-8  space-y-6">
  <div class="space-y-2">
    <h1 class="text-4xl md:text-5xl font-display leading-wide mb-6">Donation snapshot</h1>
    <p class="text-gray-700">Live statistics on donations to the GetUp movement.</p>
  </div>

  <DonationSnapshot />
</main>
