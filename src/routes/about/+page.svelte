<script lang="ts">
  import { getContext } from "svelte";
  import DonationSnapshot from "$lib/components/donation-snapshot.svelte";
  import { aboutContent } from "$lib/data/content";

  type ModalsContext = { openSignup: () => void };
  const modals = getContext<ModalsContext>("modals");

  const sections = aboutContent.sections || [];
  const findSection = (type: string) =>
    sections.find((s: any) => s.type === type) || {};

  const header = aboutContent.header || {};
  const who = findSection("who");
  const what = findSection("what");
  const how = findSection("how");
  const donations = findSection("donations");
</script>

<svelte:head>
  <title>{header.header || "About Us - GetUp"}</title>
  <meta
    name="description"
    content="GetUp is an independent movement of more than one million people building a fair, flourishing, and just Australia."
  />
</svelte:head>

<!-- Who we are (stays in sidebar layout) -->
<section class="about-section about-section--who">
  <div class="about-section__content">
    <div class="about-section__text">
      <h2 class="section__heading">
        {who.header}
      </h2>
      {#if who.body}
        <div class="about-section__body">
          {@html who.body}
        </div>
      {/if}
    </div>
    <a href="/campaigns" class="about-section__link">
      See all campaigns
      <svg
        viewBox="0 0 16 16"
        class="about-section__link-icon"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M9.707 13.707l5-5c.391-.39.391-1.024 0-1.414l-5-5c-.391-.391-1.024-.391-1.414 0s-.391 1.024 0 1.414l3.293 3.293H2.293C1.74 7.586 1.293 8.034 1.293 8.586s.448 1 1 1h9.293l-3.293 3.293c-.195.195-.293.451-.293.707s.098.512.293.707c.391.391 1.024.391 1.414 0z"
        />
      </svg>
    </a>
  </div>
</section>

<!-- Full-width sections break out of sidebar layout -->
<div class="about-page__full-width">
  <div class="about-image">
    <img
      src={who.image || "/images/power-up-group.jpg"}
      alt=""
      class="about-image__img"
    />
  </div>

  <!-- What we work on -->
  <section class="about-section about-section--what">
    <div class="about-section__container about-section__container--wide">
      <div class="about-section__header">
        <h2>
          {what.header}
        </h2>
        {#if what.body}
          <div class="about-section__intro">
            {@html what.body}
          </div>
        {/if}
      </div>
      <div class="about-pillars">
        {#each what.items || [] as item}
          <div class="about-pillar">
            <img
              src={item.image}
              alt={item.alt || item.text}
              class="about-pillar__image"
            />
            <div class="about-pillar__overlay"></div>
            <p class="about-pillar__text">
              {item.text}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- How we do it -->
  <section class="about-section about-section--how">
    <div class="about-section__container">
      <div class="about-section__layout">
        <div class="about-section__main">
          <h2 class="section__heading section__heading">
            {how.header}
          </h2>
          {#if how.body}
            <div class="about-section__body">
              {@html how.body}
            </div>
          {/if}
          <div class="about-strategies">
            {#each how.strategies || [] as strategy, i}
              <div class="about-strategy">
                <div class="about-strategy__icon">
                  {#if strategy.icon}
                    <img
                      src={strategy.icon}
                      alt=""
                      class="about-strategy__icon-img"
                    />
                  {:else if i === 0}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle
                        cx="12"
                        cy="18"
                        r="1.25"
                        fill="currentColor"
                        stroke="none"
                      />
                      <path d="M8.5 14.5a5 5 0 017 0" />
                      <path d="M6 12a8 8 0 0112 0" />
                      <path d="M3.5 9.5a11.5 11.5 0 0117 0" />
                    </svg>
                  {:else if i === 1}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 10v4a2 2 0 002 2h1l5 3V5L6 8H5a2 2 0 00-2 2z" />
                      <path d="M16 8a5 5 0 010 8" />
                      <path d="M18.5 6.5a8 8 0 010 11" />
                    </svg>
                  {:else}
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 5h16v14H4z" />
                      <path d="M16 5v14" />
                      <path d="M8 9h6" />
                      <path d="M8 13h6" />
                      <path d="M8 17h6" />
                    </svg>
                  {/if}
                </div>
                <div class="about-strategy__content">
                  <h3 class="about-strategy__heading">
                    {strategy.heading}
                  </h3>
                  <p class="about-strategy__body">{strategy.body}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
        {#if how.strategySmallImage}
          <div class="about-section__aside">
            <img
              src={how.strategySmallImage}
              alt=""
              class="about-section__aside-img"
            />
          </div>
        {/if}
      </div>
    </div>
  </section>

  {#if how.strategyImage}
    <div class="about-image">
      <img
        src={how.strategyImage}
        alt=""
        class="about-image__img"
      />
    </div>
  {/if}

  <!-- Supporting GetUp -->
  <section class="about-section about-section--donations">
    <div class="about-section__container about-section__container--wide">
      <div class="about-section__header">
        <h2 class="section__heading section__heading">
          {donations.header}
        </h2>
      </div>
      {#if donations.body}
        <div class="about-section__body about-section__body--large">
          {@html donations.body}
        </div>
      {/if}
      <div class="about-section__actions">
        {#if donations.primaryCTA}
          <a class="btn btn-primary u-arrow" href={donations.primaryCTA.url}
            >{donations.primaryCTA.text}</a
          >
        {:else}
          <a class="btn btn-primary u-arrow" href="/donate">Donate</a>
        {/if}

        {#if donations.secondaryCTA}
          <a class="btn btn-ghost" href={donations.secondaryCTA.url}
            >{donations.secondaryCTA.text}</a
          >
        {:else}
          <button type="button" class="btn btn-ghost" onclick={modals.openSignup}>Join the movement</button>
        {/if}
      </div>
    </div>
  </section>

  <!-- In the numbers -->
  <section class="about-section about-section--snapshot">
    <div class="about-section__container about-section__container--wide">
      <h2 class="section__heading section__heading--secondary">
        In the numbers
      </h2>
      <DonationSnapshot />
    </div>
  </section>
</div>

<style>
  /* ==========================================================================
     About Page Styles
     ========================================================================== */

  /* Full-width breakout wrapper - layout handles grid positioning */
  .about-page__full-width {
    display: flex;
    flex-direction: column;
  }

  /* First section - no extra padding, lives in layout grid */
  .about-section--who {
    padding: 0;
  }

  /* Full-width sections have their own padding */
  .about-page__full-width .about-section {
    padding: var(--space-12) var(--space-4);
  }

  @media (min-width: 768px) {
    .about-page__full-width .about-section {
      padding: var(--space-16) var(--space-4);
    }
  }

  .about-section__container {
    max-width: 72rem;
    margin: 0 auto;
  }

  .about-section__container--wide {
    max-width: 80rem;
  }

  /* Section Variants */
  .about-section--what {
    background: var(--color-purple);
    color: var(--color-white);
  }

  .about-section--snapshot {
    padding-bottom: var(--space-14);
  }

  /* Section Layout */
  .about-section__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .about-section__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .about-section__text {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .about-section__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  @media (min-width: 1024px) {
    .about-section__layout {
      grid-template-columns: 1fr 360px;
    }
  }

  .about-section__main {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .about-section__aside {
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .about-section__aside-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
/* 
  Headings
  .section__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-3xl), 4vw, var(--text-4xl));
    font-weight: 400;
  } */

  
  .about-section--what .section__heading,
  .about-section--what .section__heading--secondary {
    color: var(--color-white);
  }

  .section__heading--secondary {
    font-family: var(--font-sans);
    font-size: clamp(var(--text-2xl), 3vw, var(--text-3xl));
    font-weight: var(--font-bold);
    color: var(--color-purple);
  }

  /* Body Text */
  .about-section__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-slate);
  }

  .about-section--what .about-section__body {
    color: var(--color-white);
  }

  .about-section__body--large {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-slate);
  }

  .about-section__intro {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    opacity: 0.95;
  }

  /* Link */
  .about-section__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    text-transform: uppercase;
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-purple);
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  .about-section__link:hover {
    opacity: 0.8;
  }

  .about-section__link-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Actions */
  .about-section__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  /* Full Width Image */
  .about-image {
    position: relative;
    width: 100%;
    height: 380px;
  }

  @media (min-width: 768px) {
    .about-image {
      height: 480px;
    }
  }

  @media (min-width: 1024px) {
    .about-image {
      height: 520px;
    }
  }

  .about-image__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Pillars Grid */
  .about-pillars {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  @media (min-width: 640px) {
    .about-pillars {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .about-pillars {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .about-pillar {
    position: relative;
    height: 256px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  @media (min-width: 640px) {
    .about-pillar {
      height: 288px;
    }
  }

  .about-pillar__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .about-pillar__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .about-pillar__text {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    text-align: center;
    padding: var(--space-4);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    line-height: var(--leading-tight);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  /* Strategies */
  .about-strategies {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .about-strategy {
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
  }

  .about-strategy__icon {
    margin-top: var(--space-1);
    flex-shrink: 0;
    color: var(--color-purple);
  }

  .about-strategy__icon-img {
    width: 1.75rem;
    height: 1.75rem;
    object-fit: contain;
  }

  .about-strategy__content {
    flex: 1;
  }

  .about-strategy__heading {
    font-weight: var(--font-semibold);
    font-size: var(--text-lg);
    color: var(--color-slate);
    margin-bottom: var(--space-1);
  }

  .about-strategy__body {
    color: var(--color-slate-light);
    line-height: var(--leading-relaxed);
  }
</style>
