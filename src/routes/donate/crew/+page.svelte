<script>
  import TijuanaEmbed from "$lib/components/tijuana-embed.svelte";
  import { donateContent } from "$lib/data/content";

  const crew = (donateContent.sections || []).find((s) => s.type === "crew") || {};
</script>

<svelte:head>
  <title>{crew.heading} - GetUp</title>
  <meta
    name="description"
    content={crew.subhead}
  />
</svelte:head>

<main class="donate-crew-page page-main">
  <section class="donate-crew-hero">
    <div class="donate-crew-hero__container">
      <div class="donate-crew-hero__layout">
        <div class="donate-crew-hero__content">
          <h1 class="donate-crew-hero__heading">
            {crew.heading}
          </h1>
          <p class="donate-crew-hero__subhead">
            {crew.subhead}
          </p>
          {#if crew.body}
            <div class="donate-crew-hero__body">
              <p class="donate-crew-hero__text">{crew.body}</p>
            </div>
          {/if}
          {#if crew.benefits?.length}
            <div class="donate-crew-benefits donate-crew-benefits--desktop">
              {#each crew.benefits as benefit, i}
                <div class="donate-crew-benefit">
                  <h2 class="donate-crew-benefit__heading">{benefit.heading}</h2>
                  <p class="donate-crew-benefit__body">{benefit.body}</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>
        <div class="donate-crew-hero__embed">
          <TijuanaEmbed src={crew.embed} />
        </div>
      </div>
    </div>
  </section>

  {#if crew.benefits?.length}
    <section class="donate-crew-benefits-mobile">
      <div class="donate-crew-benefits-mobile__container">
        <div class="donate-crew-benefits-mobile__grid">
          {#each crew.benefits as benefit}
            <div class="donate-crew-benefit donate-crew-benefit--mobile">
              <h2 class="donate-crew-benefit__heading">{benefit.heading}</h2>
              <p class="donate-crew-benefit__body">{benefit.body}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="donate-crew-footer">
    <div class="donate-crew-footer__container">
      <div class="donate-crew-footer__card">
        <div class="donate-crew-footer__layout">
          <div class="donate-crew-footer__content">
            <h2 class="donate-crew-footer__heading">Questions?</h2>
            <p class="donate-crew-footer__text">
              Your recurring donation can be changed or cancelled at any time. We'll send you regular updates
              about how your support is making a difference.
            </p>
          </div>
          <div class="donate-crew-footer__actions">
            <a href="/about" class="btn btn-ghost u-arrow">
              Learn more about GetUp
            </a>
            <a href="/reports" class="btn btn-primary">
              See our impact
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  /* ==========================================================================
     Donate Crew Page Styles
     ========================================================================== */

  /* Hero Section */
  .donate-crew-hero {
    padding: var(--space-10) var(--space-4);
  }

  @media (min-width: 768px) {
    .donate-crew-hero {
      padding: var(--space-14) var(--space-4);
    }
  }

  .donate-crew-hero__container {
    max-width: 72rem;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .donate-crew-hero__container {
      padding-inline: var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    .donate-crew-hero__container {
      padding-inline: var(--space-8);
    }
  }

  .donate-crew-hero__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-10);
    align-items: start;
  }

  @media (min-width: 1024px) {
    .donate-crew-hero__layout {
      grid-template-columns: 1fr 1fr;
    }
  }

  .donate-crew-hero__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .donate-crew-hero__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 5vw, var(--text-5xl));
    font-weight: var(--font-normal);
    line-height: var(--leading-tight);
    color: var(--color-orange);
  }

  .donate-crew-hero__subhead {
    font-size: clamp(var(--text-xl), 2vw, var(--text-2xl));
    line-height: var(--leading-tight);
    color: var(--color-orange);
  }

  .donate-crew-hero__body {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .donate-crew-hero__text {
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-slate);
    white-space: pre-line;
  }

  .donate-crew-hero__embed {
    width: 100%;
    background: var(--color-slate-200);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--color-slate-300);
    aspect-ratio: 16 / 9;
  }

  /* Benefits */
  .donate-crew-benefits {
    display: none;
  }

  @media (min-width: 1024px) {
    .donate-crew-benefits--desktop {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  @media (min-width: 640px) {
    .donate-crew-benefits--desktop {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .donate-crew-benefit {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-sand-dark);
    background: var(--color-sand);
    box-shadow: var(--shadow-sm);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .donate-crew-benefit--mobile {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
  }

  .donate-crew-benefit__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-xl), 2vw, var(--text-2xl));
    line-height: var(--leading-snug);
    color: var(--color-slate);
  }

  .donate-crew-benefit__body {
    font-size: clamp(var(--text-base), 1.5vw, var(--text-lg));
    line-height: var(--leading-relaxed);
    color: var(--color-slate);
  }

  /* Benefits Mobile Section */
  .donate-crew-benefits-mobile {
    display: block;
    background: var(--color-white);
    padding: var(--space-12) var(--space-4);
  }

  @media (min-width: 1024px) {
    .donate-crew-benefits-mobile {
      display: none;
    }
  }

  @media (min-width: 768px) {
    .donate-crew-benefits-mobile {
      padding: var(--space-16) var(--space-4);
    }
  }

  .donate-crew-benefits-mobile__container {
    max-width: 72rem;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .donate-crew-benefits-mobile__container {
      padding-inline: var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    .donate-crew-benefits-mobile__container {
      padding-inline: var(--space-8);
    }
  }

  .donate-crew-benefits-mobile__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  @media (min-width: 768px) {
    .donate-crew-benefits-mobile__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Footer Section */
  .donate-crew-footer {
    background: var(--color-white);
    padding: 0 var(--space-4) var(--space-16) var(--space-4);
  }

  .donate-crew-footer__container {
    max-width: 72rem;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .donate-crew-footer__container {
      padding-inline: var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    .donate-crew-footer__container {
      padding-inline: var(--space-8);
    }
  }

  .donate-crew-footer__card {
    background: var(--color-sand);
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-sand-dark);
    padding: var(--space-6);
    box-shadow: var(--shadow-sm);
  }

  @media (min-width: 768px) {
    .donate-crew-footer__card {
      padding: var(--space-8);
    }
  }

  .donate-crew-footer__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
    align-items: center;
  }

  @media (min-width: 768px) {
    .donate-crew-footer__layout {
      grid-template-columns: 1fr auto;
    }
  }

  .donate-crew-footer__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .donate-crew-footer__heading {
    font-family: var(--font-sans);
    font-weight: var(--font-extrabold);
    font-size: var(--text-2xl);
    text-transform: uppercase;
    color: var(--color-slate);
  }

  .donate-crew-footer__text {
    font-size: var(--text-lg);
    color: var(--color-slate);
  }

  .donate-crew-footer__actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    justify-content: flex-end;
  }

  @media (min-width: 640px) {
    .donate-crew-footer__actions {
      flex-direction: row;
    }
  }
</style>
