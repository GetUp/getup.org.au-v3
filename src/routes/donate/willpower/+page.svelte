<script lang="ts">
  import { onMount } from "svelte";
  import TijuanaEmbed from "$lib/components/tijuana-embed.svelte";
  import { donateContent } from "$lib/data/content";

  const willpower =
    (donateContent.sections || []).find((s: any) => s.type === "willpower") || {};

  const heading: string = willpower.heading ?? "Gift in your Will";
  const body: string = willpower.body ?? "";
  const embed: string = willpower.embed ?? "";
  const hasVideo = !!embed?.trim();
  const contactHref = willpower.contact_url || "https://form.typeform.com/to/Szk0zH";
  const heroImage = "/images/media-header.jpg";

  onMount(() => {
    if (hasVideo) {
      const headerBtns = document.getElementById("header-btns");
      if (headerBtns) headerBtns.style.display = "none";
    }
  });
</script>

<svelte:head>
  <title>{heading} - GetUp</title>
  <meta name="description" content="Include GetUp in your will to power people-driven change for years to come." />
</svelte:head>

<main class="willpower-page">
  <section class="willpower-hero">
    <div class="willpower-hero__overlay"></div>
    <div class="willpower-hero__blur"></div>
    <header class="willpower-hero__content">
      <h1 class="willpower-hero__title">{heading}</h1>
      {#if body}
        <p class="willpower-hero__body">
          {body}
        </p>
      {/if}
      <div class="willpower-hero__actions" id="header-btns">
        <a class="btn btn-secondary u-arrow" href={hasVideo ? "#willpower-video" : contactHref}>
          {hasVideo ? "Watch overview" : "Get in touch"}
        </a>
        <a class="btn btn-ghost" href={contactHref} target="_blank" rel="noreferrer">
          Contact the team
        </a>
      </div>
    </header>
  </section>

  <section class="willpower-content">
    <div class="willpower-content__container">
      {#if embed?.trim()}
        <div id="willpower-video" class="willpower-video">
          <TijuanaEmbed src={embed} />
        </div>
      {/if}

      <div class="willpower-main">
        <div class="willpower-intro">
          <h2 class="willpower-intro__heading">Your legacy</h2>
          <p class="willpower-intro__text">
            We'd love to send you a booklet or discuss the opportunity further.
            <a class="willpower-link" href={contactHref} target="_blank" rel="noreferrer">Get in touch</a>.
            In the meantime, here are some details you may find helpful.
          </p>
        </div>

        <div class="willpower-sections">
          <div class="willpower-section">
            <h3 class="willpower-section__heading">What is GetUp's legal name and ACN?</h3>
            <div class="willpower-section__card">
              <p class="willpower-section__text">
                Name: GetUp Limited<br />
                ACN: 114 027 986<br />
                Address: 52 Reservoir St, Surry Hills, NSW 2010
              </p>
            </div>
            <p class="willpower-section__body">
              You may also want to share with your solicitor or Trustee Company the example wording below. Please
              <a class="willpower-link" href={contactHref} target="_blank" rel="noreferrer">let us know</a>
              if you would like us to email this to you or send a hard copy.
            </p>
          </div>

          <div class="willpower-section">
            <h3 class="willpower-section__heading">What wording should I use?</h3>
            <p class="willpower-section__body">Below is example wording you may want to include in your Will.</p>
            <div class="willpower-section__card">
              <p class="willpower-section__text">
                I give to GetUp Ltd (ACN 114 027 986) of 52 Reservoir St, Surry Hills, NSW 2010 (or its successor)...<br />
                [Choose the statement that best reflects your wishes from the following options]<br />
                - the whole of my estate or<br />
                - [insert number] percent of my estate or<br />
                - the residue of my estate or<br />
                - [insert number] percent of the residue of my estate<br />
                - The amount of $[insert number]<br />
                ...to be used for its purposes after the payment of all debts, funeral and testamentary expenses, duties and taxes payable by my estate."
              </p>
            </div>
            <p class="willpower-section__body">
              Would you like to receive this via email, or a hard copy booklet to hold and read properly?
              <a class="willpower-link" href={contactHref} target="_blank" rel="noreferrer">Get in touch</a>
              and we'll be happy to oblige!
            </p>
          </div>

          <div class="willpower-section">
            <h3 class="willpower-section__heading">What type of gift can I leave?</h3>
            <p class="willpower-section__body">
              We ask GetUp members to leave a residual bequest if they can. A residual bequest is one in which you leave a portion of your estate to GetUp.
            </p>
            <p class="willpower-section__body">Residual bequests are beneficial because:</p>
            <ul class="willpower-section__list">
              <li>They hold their value over time, regardless of inflation.</li>
              <li>They automatically adjust to changes in your estate's value.</li>
              <li>You can make sure your loved ones are taken care of first.</li>
            </ul>
            <p class="willpower-section__body">
              If you prefer, you can nominate a specific amount of money to be left to GetUp in your Will. These gifts are referred to as pecuniary bequests.
            </p>
          </div>

          <div class="willpower-section">
            <h3 class="willpower-section__heading">Letting us know</h3>
            <p class="willpower-section__body">
              When you leave your bequest to GetUp, it would be great if you could let us know. You don't have to, but we'd love to thank you personally and talk about how your visionary gift could be used.
              It's also helpful for us to know that members are supporting the movement in this way.
            </p>
          </div>
        </div>

        <div class="willpower-footer">
          <a class="btn btn-secondary" href={contactHref} target="_blank" rel="noreferrer">
            Get in touch
          </a>
          <div class="willpower-footer__card">
            <p class="willpower-footer__text">Alternatively you can contact our Donations Team</p>
            <p class="willpower-footer__contacts">
              Email:
              <a class="willpower-link" href="mailto:donations@getup.org.au">donations@getup.org.au</a><br />
              Phone:
              <a class="willpower-link" href="tel:02 8188 2888">02 8188 2888</a><br />
              Post: PO Box 190, Surry Hills, NSW 2010
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  /* ==========================================================================
     Willpower Page Styles
     ========================================================================== */

  .willpower-page {
    background: var(--color-white);
  }

  /* Hero Section */
  .willpower-hero {
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
    width: 100%;
  }

  .willpower-hero__overlay {
    position: absolute;
    inset: 0;
    background: var(--color-orange);
    z-index: 0;
    opacity: 0.85;
  }

  .willpower-hero__blur {
    position: absolute;
    inset: 0;
    z-index: -10;
    filter: blur(2px);
  }

  .willpower-hero__content {
    max-width: 80rem;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    z-index: 10;
    color: var(--color-white);
    padding: var(--space-12) var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  @media (min-width: 768px) {
    .willpower-hero__content {
      padding: var(--space-16) var(--space-4);
    }
  }

  @media (min-width: 1024px) {
    .willpower-hero__content {
      padding: var(--space-24) var(--space-4);
    }
  }

  .willpower-hero__title {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 5vw, var(--text-5xl));
    line-height: var(--leading-tight);
  }

  .willpower-hero__body {
    font-size: clamp(var(--text-lg), 2vw, var(--text-xl));
  }

  .willpower-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    justify-content: center;
    margin-top: var(--space-4);
  }

  /* Content Section */
  .willpower-content {
    background: var(--color-white);
  }

  .willpower-content__container {
    max-width: 80rem;
    margin: 0 auto;
    padding: var(--space-4);
    margin-top: calc(-1 * var(--space-14));
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
    padding-bottom: var(--space-16);
  }

  @media (min-width: 768px) {
    .willpower-content__container {
      padding: var(--space-6);
      margin-top: calc(-1 * var(--space-20));
    }
  }

  @media (min-width: 1024px) {
    .willpower-content__container {
      padding: var(--space-8);
    }
  }

  /* Video */
  .willpower-video {
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--color-sand-dark);
  }

  /* Main Content */
  .willpower-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
    color: var(--color-slate);
  }

  /* Intro */
  .willpower-intro {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .willpower-intro__heading {
    font-family: var(--font-display);
    font-size: clamp(var(--text-3xl), 4vw, var(--text-4xl));
    line-height: var(--leading-tight);
  }

  .willpower-intro__text {
    font-size: clamp(var(--text-lg), 2vw, var(--text-xl));
  }

  /* Sections */
  .willpower-sections {
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
  }

  .willpower-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .willpower-section__heading {
    font-family: var(--font-sans);
    font-weight: var(--font-extrabold);
    font-size: var(--text-xl);
    text-transform: uppercase;
    color: var(--color-orange);
  }

  .willpower-section__card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
    background: var(--color-sand);
    border: 1px solid var(--color-sand-dark);
  }

  .willpower-section__text {
    line-height: var(--leading-relaxed);
  }

  .willpower-section__body {
    font-size: var(--text-lg);
  }

  .willpower-section__list {
    list-style: disc;
    list-style-position: inside;
    font-size: var(--text-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  /* Link */
  .willpower-link {
    text-decoration: underline;
    color: inherit;
  }

  .willpower-link:hover {
    opacity: 0.8;
  }

  /* Footer */
  .willpower-footer {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .willpower-footer__card {
    padding: var(--space-5);
    border-radius: var(--radius-xl);
    background: var(--color-sand);
    border: 1px solid var(--color-sand-dark);
  }

  .willpower-footer__text {
    margin-bottom: var(--space-2);
  }

  .willpower-footer__contacts {
    line-height: var(--leading-relaxed);
  }
</style>
