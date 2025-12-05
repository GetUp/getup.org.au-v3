<script lang="ts">
  import { reportsContent as reportsData } from "$lib/data/content";
  import { slide, fade } from "svelte/transition";

  const { annual_reports, financial_reports, election_reports, title, intro } =
    reportsData;

  // --- Helpers ---
  function extractYear(title: string): string {
    const match = title.match(/(\d{4}-\d{2,4}|\d{4})/);
    return match ? match[0] : "";
  }

  function cleanTitle(title: string): string {
    const year = extractYear(title);
    if (year) return title.replace(year, "").trim();
    return title;
  }

  function getStartYear(yearStr: string): number {
    if (!yearStr) return 0;
    const parts = yearStr.split("-");
    return parseInt(parts[0], 10);
  }

  function processReports(reports: typeof annual_reports) {
    return reports.map((r) => ({
      ...r,
      yearStr: extractYear(r.title),
      displayTitle: cleanTitle(r.title),
      startYear: getStartYear(extractYear(r.title)),
    }));
  }

  // --- Data Processing ---
  const LIMIT_YEAR = 2015;
  const processedAnnual = processReports(annual_reports);
  const processedFinancial = processReports(financial_reports);
  const processedElection = processReports(election_reports);

  // --- State ---
  let searchTerm = $state("");
  let activeCategory = $state("all"); // 'all' | 'annual' | 'financial' | 'election'
  let showOlderAnnual = $state(false);
  let showOlderFinancial = $state(false);

  // --- Filtering Logic ---
  const matchesSearch = (report: any) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      report.title.toLowerCase().includes(q) ||
      report.yearStr.toLowerCase().includes(q)
    );
  };

  // Annual
  const visibleAnnual = $derived(processedAnnual.filter(matchesSearch));
  const recentAnnual = $derived(
    visibleAnnual.filter((r) => r.startYear >= LIMIT_YEAR),
  );
  const olderAnnual = $derived(
    visibleAnnual.filter((r) => r.startYear < LIMIT_YEAR),
  );

  // Financial
  const visibleFinancial = $derived(processedFinancial.filter(matchesSearch));
  const recentFinancial = $derived(
    visibleFinancial.filter((r) => r.startYear >= LIMIT_YEAR),
  );
  const olderFinancial = $derived(
    visibleFinancial.filter((r) => r.startYear < LIMIT_YEAR),
  );

  // Election (Show all usually, rarely that many)
  const visibleElection = $derived(processedElection.filter(matchesSearch));

  const categories = [
    { id: "all", label: "All Reports" },
    { id: "annual", label: "Annual Impact" },
    { id: "financial", label: "Financials" },
    { id: "election", label: "Election Reviews" },
  ];
</script>

<svelte:head>
  <title>{title || "Reports"} - GetUp</title>
  <meta
    name="description"
    content="Browse GetUp's impact reports and audited financial statements."
  />
</svelte:head>

{#snippet ReportCard(report)}
  <a
    href={report.url}
    target="_blank"
    class="reports-card"
    transition:fade|local
  >
    <div class="reports-card__content">
      {#if report.yearStr}
        <span class="reports-card__year">{report.yearStr}</span>
      {/if}
      <span class="reports-card__title">{report.displayTitle || report.title}</span>
    </div>
    <div class="reports-card__meta">
      <span class="reports-card__format">PDF</span>
      <span class="reports-card__arrow">→</span>
    </div>
  </a>
{/snippet}

<div class="reports-page">
  <!-- Header -->
  <div class="reports-header">
    <div class="reports-header__intro">
      <h1 class="reports-header__heading">
        {title}
      </h1>
      {#if intro}
        <p class="reports-header__text">{intro}</p>
      {/if}
    </div>

    <!-- Filters & Search -->
    <div class="reports-filters">
      <!-- Search -->
      <div class="reports-search">
        <svg
          class="reports-search__icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path></svg
        >
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Search by year or title..."
          class="reports-search__input"
        />
      </div>

      <!-- Category Toggles -->
      <div class="reports-categories">
        {#each categories as cat}
          <button
            onclick={() => (activeCategory = cat.id)}
            class="reports-category {activeCategory === cat.id ? 'reports-category--active' : ''}"
          >
            {cat.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Section 1: Annual Impact -->
  {#if (activeCategory === "all" || activeCategory === "annual") && visibleAnnual.length > 0}
    <section class="reports-section" transition:slide|local>
      <div class="reports-section__header">
        <h2 class="reports-section__heading">
          Annual Impact Snapshots
        </h2>
      </div>

      <div class="reports-grid">
        {#each searchTerm ? visibleAnnual : recentAnnual as report (report.url)}
          {@render ReportCard(report)}
        {/each}

        {#if !searchTerm && olderAnnual.length > 0}
          <button
            onclick={() => (showOlderAnnual = !showOlderAnnual)}
            class="reports-toggle"
          >
            <span class="reports-toggle__text"
              >{showOlderAnnual ? "Hide" : "Show"} reports from 2005-{LIMIT_YEAR -
                1}</span
            >
            <span class="reports-toggle__icon {showOlderAnnual ? 'reports-toggle__icon--open' : ''}">▼</span>
          </button>

          {#if showOlderAnnual}
            <div transition:slide class="reports-grid reports-grid--nested">
              {#each olderAnnual as report (report.url)}
                {@render ReportCard(report)}
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </section>
  {/if}

  <!-- Section 2: Financials -->
  {#if (activeCategory === "all" || activeCategory === "financial") && visibleFinancial.length > 0}
    <section class="reports-section" transition:slide|local>
      <div class="reports-section__header">
        <h2 class="reports-section__heading">
          Audited Financials
        </h2>
      </div>
      <div class="reports-grid">
        {#each searchTerm ? visibleFinancial : recentFinancial as report (report.url)}
          {@render ReportCard(report)}
        {/each}

        {#if !searchTerm && olderFinancial.length > 0}
          <button
            onclick={() => (showOlderFinancial = !showOlderFinancial)}
            class="reports-toggle"
          >
            <span class="reports-toggle__text"
              >{showOlderFinancial ? "Hide" : "Show"} reports from 2005-{LIMIT_YEAR -
                1}</span
            >
            <span class="reports-toggle__icon {showOlderFinancial ? 'reports-toggle__icon--open' : ''}">▼</span>
          </button>

          {#if showOlderFinancial}
            <div transition:slide class="reports-grid reports-grid--nested">
              {#each olderFinancial as report (report.url)}
                {@render ReportCard(report)}
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </section>
  {/if}

  <!-- Section 3: Election Reports -->
  {#if (activeCategory === "all" || activeCategory === "election") && visibleElection.length > 0}
    <section class="reports-section" transition:slide|local>
      <div class="reports-section__header">
        <h2 class="reports-section__heading">
          Election Reviews & Submissions
        </h2>
      </div>
      <div class="reports-grid">
        {#each visibleElection as report (report.url)}
          {@render ReportCard(report)}
        {/each}
      </div>
    </section>
  {/if}

  {#if visibleAnnual.length === 0 && visibleFinancial.length === 0 && visibleElection.length === 0}
    <div class="reports-empty">
      <p class="reports-empty__text">No reports found matching "{searchTerm}"</p>
      <button
        onclick={() => (searchTerm = "")}
        class="reports-empty__button"
        >Clear search</button
      >
    </div>
  {/if}
</div>

<style>
  /* ==========================================================================
     Reports Page Styles
     ========================================================================== */

  .reports-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
  }

  /* Header */
  .reports-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .reports-header__intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .reports-header__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-3xl), 4vw, var(--text-4xl));
    font-weight: 400;
    line-height: var(--leading-tight);
    color: var(--color-slate);
  }

  .reports-header__text {
    font-size: var(--text-lg);
    color: var(--color-slate-400);
    max-width: 42rem;
  }

  /* Filters */
  .reports-filters {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-1);
  }

  @media (min-width: 768px) {
    .reports-filters {
      flex-direction: row;
    }
  }

  /* Search */
  .reports-search {
    position: relative;
    flex: 1;
    max-width: 24rem;
  }

  .reports-search__icon {
    position: absolute;
    left: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: var(--color-slate-300);
  }

  .reports-search__input {
    width: 100%;
    padding-left: var(--space-10);
    padding-right: var(--space-4);
    padding-top: var(--space-2);
    padding-bottom: var(--space-2);
    border: 1px solid var(--color-slate-200);
    border-radius: var(--radius-md);
    outline: none;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .reports-search__input:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2px var(--color-orange);
  }

  /* Categories */
  .reports-categories {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .reports-category {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    border: 1px solid var(--color-slate-200);
    background: var(--color-white);
    color: var(--color-slate-400);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .reports-category:hover {
    border-color: var(--color-slate-300);
  }

  .reports-category--active {
    background: var(--color-slate);
    color: var(--color-white);
    border-color: var(--color-slate);
  }

  /* Section */
  .reports-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .reports-section__header {
    border-bottom: 1px solid var(--color-slate-200);
    padding-bottom: var(--space-2);
  }

  .reports-section__heading {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--color-slate);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Grid */
  .reports-grid {
    display: grid;
    gap: var(--space-3);
  }

  .reports-grid--nested {
    grid-column: 1 / -1;
  }

  /* Card */
  .reports-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    background: var(--color-white);
    border: 1px solid var(--color-slate-200);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .reports-card:hover {
    border-color: var(--color-orange);
    box-shadow: var(--shadow-sm);
  }

  .reports-card__content {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .reports-card__year {
    padding: var(--space-1) var(--space-3);
    background: var(--color-slate-100);
    color: var(--color-slate);
    font-weight: var(--font-bold);
    font-family: monospace;
    font-size: var(--text-sm);
    border-radius: var(--radius-sm);
    white-space: nowrap;
  }

  .reports-card__title {
    font-weight: var(--font-bold);
    color: var(--color-slate);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .reports-card:hover .reports-card__title {
    color: var(--color-orange);
  }

  .reports-card__meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-slate-300);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }

  .reports-card__format {
    display: none;
  }

  @media (min-width: 640px) {
    .reports-card__format {
      display: inline;
    }
  }

  .reports-card__arrow {
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .reports-card:hover .reports-card__arrow {
    transform: translateX(4px);
  }

  /* Toggle */
  .reports-toggle {
    width: 100%;
    text-align: left;
    padding: var(--space-3) var(--space-4);
    color: var(--color-slate-400);
    font-weight: var(--font-bold);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    background: var(--color-slate-50);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .reports-toggle:hover {
    color: var(--color-slate);
    border-color: var(--color-slate-200);
  }

  .reports-toggle__text {
    flex: 0 0 auto;
  }

  .reports-toggle__icon {
    font-size: var(--text-xs);
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .reports-toggle__icon--open {
    transform: rotate(180deg);
  }

  /* Empty State */
  .reports-empty {
    padding: var(--space-12) var(--space-4);
    text-align: center;
    color: var(--color-slate-400);
    background: var(--color-slate-50);
    border-radius: var(--radius-lg);
  }

  .reports-empty__text {
    font-size: var(--text-lg);
    margin-bottom: var(--space-2);
  }

  .reports-empty__button {
    color: var(--color-orange);
    font-weight: var(--font-bold);
    cursor: pointer;
    background: none;
    border: none;
    text-decoration: underline;
  }

  .reports-empty__button:hover {
    opacity: 0.8;
  }
</style>
