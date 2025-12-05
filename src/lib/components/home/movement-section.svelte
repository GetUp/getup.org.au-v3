<script lang="ts">
  import { getContext, onMount } from "svelte";

  let { data } = $props();

  type ModalsContext = { openSignup: () => void };
  const modals = getContext<ModalsContext>("modals");

  const heading = data.heading || "Our movement";
  const memberCount = data.memberCount || "1,000,000+";
  const memberLabel = data.memberLabel || "members strong";
  const body = data.body || "";
  const backgroundImage = data.backgroundImage || "/images/invasion-day-rally.jpg";
  const testimonials = data.testimonials?.length
    ? data.testimonials
    : data.quote
      ? [data.quote]
      : [];
  const ctas = data.ctas || [];

  let activeIndex = $state(0);

  function handleCtaClick(e: MouseEvent, cta: any) {
    if (cta.link === "#signup") {
      e.preventDefault();
      modals.openSignup();
    }
  }

  onMount(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        activeIndex = (activeIndex + 1) % testimonials.length;
      }, 6000);
      return () => clearInterval(interval);
    }
  });
</script>

<section class="movement">
  <!-- Background Image with Overlay -->
  <div class="movement__bg">
    <img
      src={backgroundImage}
      alt="GetUp members at a rally"
      class="movement__bg-image"
      loading="lazy"
    />
    <div class="movement__overlay"></div>
  </div>

  <div class="movement__container">
    <!-- Stats Hero -->
    <div class="movement__hero">
      <p class="movement__count">{memberCount}</p>
      <p class="movement__label">{memberLabel}</p>
    </div>

    <!-- Content Grid -->
    <div class="movement__content">
      <!-- Body Text -->
      <div class="movement__text">
        <h2 class="movement__heading font-header">{heading}</h2>
        {#if body}
          <p class="movement__body">{body}</p>
        {/if}
      </div>

      <!-- Quote Card (if exists) -->
      {#if testimonials.length > 0}
        <div class="movement__quote-card">
          {#each testimonials as t, i}
            <div
              class="movement__quote-item"
              class:movement__quote-item--active={i === activeIndex}
            >
              <blockquote class="movement__quote">
                "{t.text}"
              </blockquote>
              <div class="movement__author">
                <span class="movement__author-name">{t.author}</span>
                {#if t.authorLabel}
                  <span class="movement__author-label">{t.authorLabel}</span>
                {/if}
              </div>
            </div>
          {/each}

          {#if testimonials.length > 1}
            <div class="movement__dots">
              {#each testimonials as _, i}
                <button
                  type="button"
                  class="movement__dot"
                  class:movement__dot--active={i === activeIndex}
                  onclick={() => (activeIndex = i)}
                  aria-label={`Go to quote ${i + 1}`}
                ></button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- CTAs -->
    {#if ctas.length > 0}
      <div class="movement__ctas">
        {#each ctas as cta}
          <a
            href={cta.link}
            class="movement__cta"
            class:movement__cta--secondary={cta.style === "secondary"}
            onclick={(e) => handleCtaClick(e, cta)}
          >
            {cta.label}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .movement {
    position: relative;
    padding: 4rem 1rem;
    min-height: 500px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .movement {
      padding: 6rem 1.5rem;
      min-height: 600px;
    }
  }

  .movement__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .movement__bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  .movement__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(74, 71, 214, 0.92) 0%,
      rgba(74, 71, 214, 0.85) 50%,
      rgba(74, 71, 214, 0.75) 100%
    );
  }

  @media (min-width: 768px) {
    .movement__overlay {
      background: linear-gradient(
        to right,
        rgba(74, 71, 214, 0.95) 0%,
        rgba(74, 71, 214, 0.85) 40%,
        rgba(74, 71, 214, 0.6) 70%,
        rgba(74, 71, 214, 0.4) 100%
      );
    }
  }

  .movement__container {
    position: relative;
    z-index: 1;
    max-width: 72rem;
    margin: 0 auto;
    width: 100%;
  }

  .movement__hero {
    text-align: center;
    margin-bottom: 2rem;
  }

  @media (min-width: 768px) {
    .movement__hero {
      text-align: left;
      margin-bottom: 2.5rem;
    }
  }

  .movement__count {
    font-size: 4rem;
    font-weight: 900;
    color: white;
    line-height: 1;
    margin: 0;
    font-family: var(--font-header);
  }

  @media (min-width: 768px) {
    .movement__count {
      font-size: 5rem;
    }
  }

  @media (min-width: 1024px) {
    .movement__count {
      font-size: 6rem;
    }
  }

  .movement__label {
    font-size: 1.25rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin: 0.25rem 0 0 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (min-width: 768px) {
    .movement__label {
      font-size: 1.5rem;
    }
  }

  .movement__content {
    display: grid;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .movement__content {
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }
  }

  .movement__text {
    color: white;
  }

  .movement__heading {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  @media (min-width: 768px) {
    .movement__heading {
      font-size: 2rem;
    }
  }

  .movement__body {
    font-size: 1rem;
    line-height: 1.7;
    margin: 0;
    opacity: 0.95;
  }

  @media (min-width: 768px) {
    .movement__body {
      font-size: 1.125rem;
    }
  }

  .movement__quote-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  @media (min-width: 768px) {
    .movement__quote-card {
      padding: 2rem;
    }
  }

  .movement__quote-item {
    display: none;
  }

  .movement__quote-item--active {
    display: block;
  }

  .movement__quote {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.6;
    color: var(--color-slate, #1e293b);
    margin: 0 0 1rem 0;
    font-style: italic;
  }

  @media (min-width: 768px) {
    .movement__quote {
      font-size: 1.25rem;
    }
  }

  .movement__author {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .movement__author-name {
    font-weight: 700;
    color: var(--color-orange, #f97316);
    font-size: 1rem;
  }

  .movement__author-label {
    font-size: 0.875rem;
    color: var(--color-slate-light, #64748b);
  }

  .movement__dots {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .movement__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-slate-light, #cbd5e1);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .movement__dot:hover {
    background: var(--color-slate, #64748b);
  }

  .movement__dot--active {
    background: var(--color-orange, #f97316);
    transform: scale(1.25);
  }

  .movement__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .movement__ctas {
      justify-content: flex-start;
      margin-top: 2.5rem;
    }
  }

  .movement__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    background: var(--color-orange, #f97316);
    color: white;
    border: 2px solid var(--color-orange, #f97316);
  }

  .movement__cta:hover {
    background: var(--color-orange-dark, #ea580c);
    border-color: var(--color-orange-dark, #ea580c);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
  }

  .movement__cta--secondary {
    background: transparent;
    color: white;
    border-color: white;
  }

  .movement__cta--secondary:hover {
    background: white;
    color: var(--color-purple, #4a47d6);
    border-color: white;
  }
</style>
