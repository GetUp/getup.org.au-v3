<script lang="ts">
  import page from "../../../../content/transparency-page.json";
  import majorDonations from "../../../../content/major-donations-disclosures.json";
  import { renderMarkdown } from "$lib/utils/markdown";

  const blockData = {
    major_donations_disclosures: majorDonations,
    donations_disclosures: majorDonations,
  };

  const blocks =
    page.blocks?.map((block, index) => {
      const title = block.title || block.heading || "";
      const navTitle = block.nav_title || title;
      return {
        ...block,
        id: block.id || `section-${index + 1}`,
        title,
        navTitle,
        data: blockData[block.type as keyof typeof blockData],
      };
    }) ?? [];

  function formatCurrency(value?: number | null) {
    if (value === undefined || value === null || Number.isNaN(value)) return "";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(value);
  }
</script>

<svelte:head>
  <title>Transparency Disclosures</title>
  <meta
    name="description"
    content="Transparency, donations disclosures, and reports from the GetUp movement."
  />
</svelte:head>

<main class="min-h-screen bg-white">
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
    <h1 class="text-4xl md:text-5xl font-display leading-tight mb-6">Transparency Disclosures</h1>
    {#each blocks as block (block.id)}
      {#if block.type === "markdown"}
        <section id={block.id} class="space-y-4">
          <div class="prose max-w-none">
            {@html renderMarkdown(block.body || "")}
          </div>
        </section>
      {:else if block.type === "major_donations_disclosures"}
        <section id={block.id} class="space-y-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 class="text-3xl font-bold text-slate-900">
                {block.title || "Major Donations Disclosures"}
              </h2>
              {#if block.intro}
                <div class="prose max-w-none text-gray-700">
                  {@html renderMarkdown(block.intro)}
                </div>
              {/if}
            </div>
          </div>
          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Name
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Financial Year
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {#each block.data?.donations ?? [] as row (row.name + row.financial_year + row.amount)}
                  <tr>
                    <td class="px-4 py-3 text-sm font-semibold text-slate-900">{row.name}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{row.financial_year}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 font-bold">
                      {formatCurrency(row.amount as number)}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </section>
      {/if}
    {/each}
  </div>
</main>
