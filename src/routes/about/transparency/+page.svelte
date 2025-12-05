<script lang="ts">
  import { aboutTransparency } from "$lib/data/content";
  import { renderMarkdown } from "$lib/utils/markdown";

  // --- Data Loading ---
  const transparencySection = aboutTransparency || {};
  const pageData = {
    title: transparencySection.title || "Transparency & Accountability",
    slug: transparencySection.slug || "transparency",
    blocks: transparencySection.blocks || [],
  };

  const blocks =
    (pageData.blocks as any[] | undefined)?.map((block: any, index: number) => {
      const title = block.title || block.heading || "";
      const navTitle = block.nav_title || title;
      return {
        ...block,
        id: block.id || `section-${index + 1}`,
        title,
        navTitle,
      };
    }) ?? [];

  // --- Block Separation ---
  const disclosureIndex = blocks.findIndex(
    (b) => b.type === "major_donations_disclosures",
  );
  const disclosureBlock =
    disclosureIndex !== -1 ? blocks[disclosureIndex] : null;

  const beforeBlocks =
    disclosureIndex !== -1 ? blocks.slice(0, disclosureIndex) : blocks;
  const afterBlocks =
    disclosureIndex !== -1 ? blocks.slice(disclosureIndex + 1) : [];

  // --- Helper Functions ---
  function formatCurrency(value?: number | null) {
    if (value === undefined || value === null || Number.isNaN(value)) return "";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  const sevenYearsAgo = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 7);
    return d;
  })();

  const processRows = (rows: any[] = []) =>
    rows
      .map((row) => {
        const yearString = String(row.financial_year || "");
        const firstYear = parseInt(yearString.split("/")[0], 10);
        const date = Number.isFinite(firstYear)
          ? new Date(firstYear, 6, 1)
          : null;
        return { ...row, derivedDate: date };
      })
      .filter((row) => !row.derivedDate || row.derivedDate >= sevenYearsAgo)
      .sort((a, b) => {
        const aTime = a.derivedDate ? a.derivedDate.getTime() : 0;
        const bTime = b.derivedDate ? b.derivedDate.getTime() : 0;
        return bTime - aTime;
      });

  const allDonations = disclosureBlock
    ? processRows(disclosureBlock.donations)
    : [];

  // --- Filters ---
  const financialYears = Array.from(
    new Set(allDonations.map((d) => d.financial_year as string)),
  )
    .filter(Boolean)
    // Sort descending (e.g. 2023/2024 before 2022/2023)
    .sort((a, b) => b.localeCompare(a));

  let activeYear = $state("all");
  let currentPage = $state(1);
  const ITEMS_PER_PAGE = 20;

  // --- Derived State ---
  const filteredDonations = $derived(
    activeYear === "all"
      ? allDonations
      : allDonations.filter((d) => d.financial_year === activeYear),
  );

  const totalPages = $derived(
    Math.ceil(filteredDonations.length / ITEMS_PER_PAGE),
  );

  // Reset page when filter changes
  $effect(() => {
    // dependency on activeYear
    const _ = activeYear;
    currentPage = 1;
  });

  const paginatedDonations = $derived(
    filteredDonations.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    ),
  );

  const categories = [
    { id: "all", label: "All Years" },
    ...financialYears.map((y) => ({ id: y, label: y })),
  ];
</script>

<svelte:head>
  <title>{pageData.title || "Transparency"}</title>
  <meta
    name="description"
    content="Transparency, donations disclosures, and reports from the GetUp movement."
  />
</svelte:head>

<main class="min-h-screen bg-white">
  <section class="space-y-12">
    <h1 class="text-4xl md:text-5xl font-display leading-wide mb-6">
      {pageData.title}
    </h1>

    <!-- Before Content -->
    {#each beforeBlocks as block (block.id)}
      <section id={block.id} class="space-y-4">
        {#if block.title}
          <h2 class="text-2xl font-bold font-display text-slate-900">
            {block.title}
          </h2>
        {/if}
        <div class="prose max-w-none text-slate-700">
          {@html renderMarkdown(block.body || "")}
        </div>
      </section>
    {/each}

    <!-- Donation Disclosures -->
    {#if disclosureBlock}
      <section
        id={disclosureBlock.id}
        class="space-y-6 pt-8 border-t border-slate-100"
      >
        <div>
          <h2 class="text-2xl mb-4 font-subheader text-slate-900">
            {disclosureBlock.title || "Major Donations Disclosures"}
          </h2>
          {#if disclosureBlock.intro}
            <div class="prose max-w-none text-gray-700 mb-4">
              {@html renderMarkdown(disclosureBlock.intro)}
            </div>
          {/if}
          {#if disclosureBlock.disclaimer}
            <p
              class="text-sm text-gray-500 italic border-l-4 border-orange-200 pl-3 py-1 bg-orange-50/50 rounded-r"
            >
              Note: {disclosureBlock.disclaimer}
            </p>
          {/if}
        </div>

        <!-- Year Toggles -->
        <div class="flex flex-wrap gap-2">
          {#each categories as cat}
            <button
              onclick={() => (activeYear = cat.id)}
              class="px-3 py-1.5 rounded-full text-sm font-bold transition-colors border {activeYear ===
              cat.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}"
            >
              {cat.label}
            </button>
          {/each}
        </div>

        <!-- Table -->
        <div
          class="overflow-hidden border border-gray-200 rounded-lg shadow-sm"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Financial Year
                  </th>
                  <th
                    class="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {#if paginatedDonations.length === 0}
                  <tr>
                    <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                      No records found for this period.
                    </td>
                  </tr>
                {:else}
                  {#each paginatedDonations as row (row.name + row.financial_year + row.amount)}
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-3 text-sm font-semibold text-slate-900"
                        >{row.name}</td
                      >
                      <td class="px-4 py-3 text-sm text-gray-600 font-mono"
                        >{row.financial_year}</td
                      >
                      <td
                        class="px-4 py-3 text-sm text-slate-900 font-bold text-right font-mono"
                      >
                        {formatCurrency(row.amount as number)}
                      </td>
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        {#if totalPages > 1}
          <div
            class="flex items-center justify-between border-t border-gray-200 pt-4"
          >
            <span class="text-sm text-gray-500">
              Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong>
              to
              <strong
                >{Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredDonations.length,
                )}</strong
              >
              of <strong>{filteredDonations.length}</strong>
            </span>
            <div class="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onclick={() => currentPage--}
                class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-600 font-medium"
                >Page {currentPage}</span
              >
              <button
                disabled={currentPage === totalPages}
                onclick={() => currentPage++}
                class="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        {/if}
      </section>
    {/if}

    <!-- After Content -->
    {#each afterBlocks as block (block.id)}
      <section id={block.id} class="space-y-4 pt-8 border-t border-slate-100">
        {#if block.title}
          <h2 class="text-2xl font-bold font-display text-slate-900">
            {block.title}
          </h2>
        {/if}
        <div class="prose max-w-none text-slate-700">
          {@html renderMarkdown(block.body || "")}
        </div>
      </section>
    {/each}
  </section>
</main>
