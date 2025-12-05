<script>
  import BoardSection from "$lib/components/board-section.svelte";
  import { aboutBoard } from "$lib/data/content";
  import { marked } from "marked";

  const { heading, intro, accordions = [] } = aboutBoard || {};
  const introHtml = intro ? marked.parse(intro) : "";
</script>

<svelte:head>
  <title>{heading || "Board"} - GetUp</title>
  <meta
    name="description"
    content="Meet the GetUp Board guiding our governance, accountability, and strategy."
  />
</svelte:head>

<section class="board-page">
  <div class="board-intro">
    <h1 class="board-intro__heading">
      {heading || "Our Board"}
    </h1>
    {#if introHtml}
      <div class="board-intro__content">
        {@html introHtml}
      </div>
    {/if}
  </div>

  <BoardSection data={aboutBoard} />

  {#if accordions && accordions.length > 0}
    <div class="board-governance">
      <h2 class="board-governance__heading">
        Governance & Accountability
      </h2>
      <div class="board-accordions">
        {#each accordions as item}
          <details class="board-accordion">
            <summary class="board-accordion__summary">
              <span class="board-accordion__title">{item.title}</span>
              <span class="board-accordion__icon">
                <svg
                  fill="none"
                  height="24"
                  shape-rendering="geometricPrecision"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  width="24"><path d="M6 9l6 6 6-6"></path></svg
                >
              </span>
            </summary>
            <div class="board-accordion__content">
              {@html marked.parse(item.body || "")}
            </div>
          </details>
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  /* ==========================================================================
     Board Page Styles
     ========================================================================== */

  .board-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
  }

  /* Intro Section */
  .board-intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 56rem;
  }

  .board-intro__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 5vw, var(--text-5xl));
    font-weight: 400;
    line-height: var(--leading-wide);
    color: var(--color-slate);
  }

  .board-intro__content {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-slate);
  }

  .board-intro__content :global(p) {
    margin-bottom: var(--space-4);
  }

  .board-intro__content :global(a) {
    color: var(--color-orange);
    text-decoration: underline;
  }

  .board-intro__content :global(a:hover) {
    opacity: 0.8;
  }

  /* Governance Section */
  .board-governance {
    border-top: 1px solid var(--color-slate-300);
    padding-top: var(--space-12);
    max-width: 56rem;
  }

  .board-governance__heading {
    font-family: var(--font-sans);
    font-size: clamp(var(--text-2xl), 3vw, var(--text-3xl));
    font-weight: var(--font-bold);
    color: var(--color-slate);
    margin-bottom: var(--space-8);
  }

  /* Accordions */
  .board-accordions {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--color-slate-300);
  }

  .board-accordion {
    border-top: 1px solid var(--color-slate-300);
  }

  .board-accordion__summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    cursor: pointer;
    list-style: none;
    padding: var(--space-6) 0;
    color: var(--color-slate);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .board-accordion__summary:hover {
    color: var(--color-orange);
  }

  .board-accordion__summary::-webkit-details-marker {
    display: none;
  }

  .board-accordion__title {
    flex: 1;
  }

  .board-accordion__icon {
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .board-accordion[open] .board-accordion__icon {
    transform: rotate(180deg);
  }

  .board-accordion__content {
    color: var(--color-slate);
    padding-bottom: var(--space-6);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
  }

  .board-accordion__content :global(p) {
    margin-bottom: var(--space-4);
  }

  .board-accordion__content :global(a) {
    color: var(--color-orange);
    text-decoration: underline;
  }

  .board-accordion__content :global(a:hover) {
    opacity: 0.8;
  }

  .board-accordion__content :global(ul),
  .board-accordion__content :global(ol) {
    margin-left: var(--space-6);
    margin-bottom: var(--space-4);
  }

  .board-accordion__content :global(li) {
    margin-bottom: var(--space-2);
  }

  .board-accordion__content :global(h3),
  .board-accordion__content :global(h4) {
    font-weight: var(--font-bold);
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
    color: var(--color-slate);
  }
</style>
