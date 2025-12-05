<script>
  import { reportsContent } from "$lib/data/content";

  let { content = reportsContent } = $props();
</script>

<section id="transparency" class="transparency-section">
  <header class="transparency-hero">
    <div class="transparency-hero__overlay">
      {#if content.header.image}
        <div
          class="transparency-hero__image"
          style={`background-image: url(${content.header.image});`}
        ></div>
      {/if}
      <div class="transparency-hero__gradient"></div>
    </div>
    <div class="transparency-hero__content">
      <div class="transparency-hero__text">
        <h1 class="transparency-hero__heading">
          {content.header.heading}
        </h1>
        <p class="transparency-hero__subhead">
          {content.header.subhead}
        </p>
      </div>
    </div>
  </header>

  <div class="transparency-reports">
    <div class="transparency-reports__container">
      <div class="transparency-reports__grid">
        {#each content.reports as report}
          <a href={report.link} class="transparency-report">
            <div class="transparency-report__image-wrapper">
              <img
                src={report.image}
                alt={report.heading}
                class="transparency-report__image"
              />
            </div>
            <div class="transparency-report__content">
              <h3 class="transparency-report__heading">{report.heading}</h3>
              <p class="transparency-report__description">{report.description}</p>
              <span class="transparency-report__link">Open report →</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  /* ==========================================================================
     Transparency Section Component
     ========================================================================== */

  .transparency-section {
    background: var(--color-white);
    scroll-snap-align: start;
  }

  /* Hero Section */
  .transparency-hero {
    position: relative;
    overflow: hidden;
    background: var(--color-orange);
  }

  .transparency-hero__overlay {
    position: absolute;
    inset: 0;
    opacity: 0.3;
  }

  .transparency-hero__image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .transparency-hero__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(120, 60, 20, 0.7),
      rgba(140, 70, 30, 0.6),
      rgba(160, 80, 40, 0.7)
    );
  }

  .transparency-hero__content {
    max-width: 80rem;
    margin: 0 auto;
    padding: var(--space-10) var(--space-4);
    position: relative;
    color: var(--color-white);
  }

  @media (min-width: 768px) {
    .transparency-hero__content {
      padding: var(--space-14) var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    .transparency-hero__content {
      padding: var(--space-14) var(--space-8);
    }
  }

  .transparency-hero__text {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .transparency-hero__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 5vw, var(--text-6xl));
    font-weight: var(--font-normal);
    line-height: var(--leading-wide);
  }

  .transparency-hero__subhead {
    font-size: clamp(var(--text-lg), 2vw, var(--text-xl));
    max-width: 48rem;
  }

  /* Reports Grid */
  .transparency-reports {
    padding: var(--space-16) var(--space-4);
    background: var(--color-white);
  }

  .transparency-reports__container {
    max-width: 80rem;
    margin: 0 auto;
  }

  .transparency-reports__grid {
    display: grid;
    gap: var(--space-8);
  }

  @media (min-width: 1024px) {
    .transparency-reports__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Report Card */
  .transparency-report {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
    background: var(--color-sand);
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: box-shadow var(--duration-fast) var(--ease-out);
  }

  .transparency-report:hover {
    box-shadow: var(--shadow-lg);
  }

  @media (min-width: 768px) {
    .transparency-report {
      grid-template-columns: 1fr 2fr;
    }
  }

  .transparency-report__image-wrapper {
    height: 12rem;
  }

  @media (min-width: 768px) {
    .transparency-report__image-wrapper {
      height: 100%;
    }
  }

  .transparency-report__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .transparency-report__content {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-2);
  }

  @media (min-width: 768px) {
    .transparency-report__content {
      padding: var(--space-6);
    }
  }

  .transparency-report__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-xl), 2vw, var(--text-2xl));
    font-weight: var(--font-normal);
    color: var(--color-slate);
    line-height: var(--leading-wide);
  }

  .transparency-report__description {
    color: var(--color-slate-200);
    line-height: var(--leading-relaxed);
  }

  .transparency-report__link {
    color: var(--color-orange);
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
  }
</style>
