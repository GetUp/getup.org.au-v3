<script lang="ts">
  import { onMount } from "svelte";
  import Accordion from "$lib/components/accordion.svelte";
  import { aboutWork } from "$lib/data/content";

  const workSection = aboutWork || {};

  const heading = workSection.heading ?? "Work at GetUp";
  const subheading = workSection.subheading ?? "";
  const intro = workSection.intro ?? "";
  const bullets: string[] = workSection.bullets ?? [];
  const ctaLabel = workSection.cta_label ?? "View current vacancies";
  const ctaHref = workSection.cta_href ?? "#vacancies";
  const heroImage =
    workSection.hero_image ?? "/images/uploads/work-at-getup.jpg";
  const benefits = workSection.benefits ?? [];
  const values = workSection.values ?? [];

  let isClient = $state(false);
  onMount(() => (isClient = true));
</script>

<svelte:head>
  <title>Work at GetUp</title>
  <meta
    name="description"
    content="Join the team powering a million-strong movement for a fair, flourishing, and just Australia."
  />
</svelte:head>

<section class="work-page">
  <div class="work-intro">
    <h1 class="work-intro__heading">
      {heading}
    </h1>
    {#if subheading}
      <h2 class="work-intro__subheading">
        {subheading}
      </h2>
    {/if}
    <div class="work-intro__content">
      {#each intro.split(/\n+/) as paragraph}
        {#if paragraph.trim()}
          <p class="work-intro__paragraph">{paragraph.trim()}</p>
        {/if}
      {/each}
      {#if bullets?.length}
        <ul class="work-intro__list">
          {#each bullets as item}
            <li class="work-intro__list-item">{item}</li>
          {/each}
        </ul>
      {/if}
    </div>
    <div class="work-intro__cta">
      <a href={ctaHref} class="btn btn-primary u-arrow">{ctaLabel}</a>
    </div>
  </div>

  <div class="work-image">
    <img
      src={heroImage}
      alt="Work at GetUp"
      class="work-image__img"
      loading="lazy"
    />
  </div>

  <div class="work-features">
    <div class="work-feature">
      <h2 class="work-feature__heading">
        Employee Benefits
      </h2>
      <div class="work-feature__accordions">
        {#each benefits as benefit, i}
          <Accordion title={benefit.title} open={i === 0}>
            {#if benefit.description}
              <p class="work-feature__description">
                {benefit.description}
              </p>
            {/if}
          </Accordion>
        {/each}
      </div>
    </div>
    <div class="work-feature">
      <h2 class="work-feature__heading">Our Values</h2>
      <div class="work-feature__accordions">
        {#each values as value, i}
          <Accordion title={value.title} open={i === 0}>
            {#if value.description}
              <p class="work-feature__description">
                {value.description}
              </p>
            {/if}
          </Accordion>
        {/each}
      </div>
    </div>
  </div>

  <div id="vacancies" class="work-vacancies">
    <h2 class="work-vacancies__heading">
      Current vacancies
    </h2>
    <div class="work-vacancies__embed">
      {#if isClient}
        <iframe
          title="GetUp Careers"
          src="https://getup.recruiterbox.com/?embed=true"
          class="work-vacancies__iframe"
          loading="lazy"
        ></iframe>
      {:else}
        <div class="work-vacancies__loading">Loading roles…</div>
      {/if}
    </div>
  </div>
</section>

<style>
  /* ==========================================================================
     Work at GetUp Page Styles
     ========================================================================== */

  .work-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
  }

  /* Intro Section */
  .work-intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .work-intro__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 5vw, var(--text-5xl));
    font-weight: 400;
    line-height: var(--leading-wide);
    margin-bottom: var(--space-6);
    color: var(--color-slate);
  }

  .work-intro__subheading {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-6);
    color: var(--color-slate);
  }

  .work-intro__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .work-intro__paragraph {
    line-height: var(--leading-relaxed);
    color: var(--color-slate);
  }

  .work-intro__list {
    list-style: disc;
    list-style-position: inside;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .work-intro__list-item {
    line-height: var(--leading-relaxed);
    color: var(--color-slate);
  }

  .work-intro__cta {
    margin-top: var(--space-2);
  }

  /* Image */
  .work-image {
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .work-image__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Features Grid */
  .work-features {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  @media (min-width: 768px) {
    .work-features {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .work-feature {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .work-feature__heading {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-6);
    color: var(--color-slate);
  }

  .work-feature__accordions {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-slate-300);
    border-radius: var(--radius-lg);
    background: var(--color-white);
    overflow: hidden;
  }

  .work-feature__accordions :global(.accordion) {
    border-bottom: 1px solid var(--color-slate-300);
  }

  .work-feature__accordions :global(.accordion:last-child) {
    border-bottom: none;
  }

  .work-feature__description {
    font-size: var(--text-sm);
    color: var(--color-slate);
    line-height: var(--leading-relaxed);
  }

  /* Vacancies */
  .work-vacancies {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .work-vacancies__heading {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-6);
    color: var(--color-slate);
  }

  .work-vacancies__embed {
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-slate-300);
    background: var(--color-white);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .work-vacancies__iframe {
    width: 100%;
    min-height: 900px;
    border: none;
  }

  .work-vacancies__loading {
    padding: var(--space-6);
    text-align: center;
    color: var(--color-slate-400);
  }
</style>
