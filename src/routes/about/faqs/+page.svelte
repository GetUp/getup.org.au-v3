<script lang="ts">
  import { aboutFaqs } from "$lib/data/content";
  import { renderMarkdown } from "$lib/utils/markdown";
  import Accordion from "$lib/components/accordion.svelte";

  const faqsSection = aboutFaqs || { items: [] };

  const faqs = [...(faqsSection.items || [])].sort(
    (a: any, b: any) => (a.order ?? 999) - (b.order ?? 999),
  );

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    acc[faq.section] = acc[faq.section] || [];
    acc[faq.section].push(faq);
    return acc;
  }, {});
</script>

<svelte:head>
  <title>Frequently Asked Questions - GetUp</title>
  <meta
    name="description"
    content="Answers to common questions about GetUp, donations, and getting involved."
  />
</svelte:head>

<section class="faqs-page">
  <div class="faqs-header">
    <h1 class="faqs-header__heading">
      Frequently Asked Questions
    </h1>
    <p class="faqs-header__intro">
      Find answers about GetUp, donations, subscriptions, and getting involved.
    </p>
  </div>

  <div class="faqs-sections">
    {#each Object.keys(grouped) as section}
      <div class="faqs-section">
        <h2 class="section__heading">{section}</h2>
        <div class="faqs-section__items">
          {#each grouped[section] as faq}
            <Accordion title={faq.title}>
              {#if faq.content || faq.body || faq.answer}
                <div class="faqs-answer">
                  {@html renderMarkdown(
                    faq.content || faq.body || faq.answer || "",
                  )}
                </div>
              {:else}
                <p class="faqs-placeholder">Details coming soon.</p>
              {/if}
            </Accordion>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  /* ==========================================================================
     FAQs Page Styles
     ========================================================================== */

  .faqs-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
  }

  /* Header */
  .faqs-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .faqs-header__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 5vw, var(--text-5xl));
    font-weight: 400;
    line-height: var(--leading-wide);
    margin-bottom: var(--space-6);
    color: var(--color-slate);
  }

  .faqs-header__intro {
    font-size: var(--text-lg);
    color: var(--color-slate);
  }

  /* Sections */
  .faqs-sections {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .faqs-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .section__heading {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-6);
    color: var(--color-slate);
  }

  .faqs-section__items {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  /* Answer Content */
  .faqs-answer {
    max-width: none;
    color: var(--color-slate);
  }

  .faqs-answer :global(p) {
    margin-bottom: var(--space-4);
    line-height: var(--leading-relaxed);
  }

  .faqs-answer :global(a) {
    color: var(--color-orange);
    text-decoration: underline;
  }

  .faqs-answer :global(a:hover) {
    opacity: 0.8;
  }

  .faqs-answer :global(ul),
  .faqs-answer :global(ol) {
    margin-left: var(--space-6);
    margin-bottom: var(--space-4);
  }

  .faqs-answer :global(li) {
    margin-bottom: var(--space-2);
  }

  .faqs-answer :global(strong) {
    font-weight: var(--font-bold);
  }

  .faqs-answer :global(em) {
    font-style: italic;
  }

  .faqs-answer :global(h3),
  .faqs-answer :global(h4) {
    font-weight: var(--font-bold);
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
  }

  .faqs-placeholder {
    color: var(--color-slate-400);
    font-size: var(--text-sm);
  }
</style>
