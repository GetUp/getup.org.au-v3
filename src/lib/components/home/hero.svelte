<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Ticker from "../ticker.svelte";

  let { hero, onOpenSignup = () => {} } = $props();

  // Content
  const images = hero?.images || (hero?.image ? [hero.image] : ["/images/women-htv-og-tote.png"]);
  const description = hero?.description || "Join over a million GetUp members fighting for a fair, flourishing, and just Australia.";
  const ctaType = hero?.ctaType || "signup";
  const primary = hero?.primaryButton || (hero?.button ? { label: hero.button, url: "#" } : null);
  const secondary = hero?.secondaryButton;

  // Format title with underline on final word
  function formatTitle(raw) {
    const defaultTitle = 'People. Power. <span class="u-underlined u-underlined--white">Impact.</span>';
    if (!raw) return defaultTitle;
    const words = raw.trim().split(/\s+/);
    if (words.length === 0) return defaultTitle;
    const last = words.pop();
    return `${words.join(" ")} <span class="u-underlined u-underlined--white">${last}</span>`;
  }

  const title = formatTitle(hero?.title || hero?.heading);

  // Image carousel
  let activeIndex = $state(0);

  // Form state
  const FormStatus = {
    READY: 'ready',
    LOADING: 'loading',
    SUCCESS: 'success',
    THROTTLED: 'throttled',
    ERROR: 'error',
  };

  let email = $state("");
  let postcode = $state("");
  let firstName = $state("");
  let lastName = $state("");
  let phone = $state("");
  let formStatus = $state(FormStatus.READY);
  let errorMessage = $state("");
  let showDetailsDialog = $state(false);

  // Always collect additional details in modal
  const additionalFields = ["firstName", "lastName", "postcode", "phone"];

  onMount(() => {
    // Image carousel interval
    if (images.length > 1) {
      const interval = setInterval(() => {
        activeIndex = (activeIndex + 1) % images.length;
      }, 5000);
      return () => clearInterval(interval);
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || formStatus === FormStatus.LOADING) return;

    // Submit email immediately
    await submitToAPI(false);

    // If submission succeeded, show modal to collect additional details
    if (formStatus === FormStatus.SUCCESS) {
      showDetailsDialog = true;
    }
  }

  async function submitToAPI(isUpdate = false) {
    if (formStatus === FormStatus.LOADING) return;

    formStatus = FormStatus.LOADING;
    errorMessage = "";

    try {
      const response = await fetch('https://api.gu.tools/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          post_code: postcode,
          reason: 'website-home-hero-inline',
          token: '',
        }),
      });

      if (response.status === 200) {
        // Track success
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'subscribe',
            result: 'success',
            isUpdate: isUpdate
          });
        }
        formStatus = FormStatus.SUCCESS;
        return true;
      } else if (response.status === 429) {
        // Rate limited
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({ event: 'subscribe', result: 'throttled' });
        }
        formStatus = FormStatus.THROTTLED;
        errorMessage = "Too many requests. Please try again later.";
        return false;
      } else {
        throw new Error(`Subscription failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'subscribe',
          result: 'error',
          error: error.message
        });
      }
      formStatus = FormStatus.ERROR;
      errorMessage = "Something went wrong. Please try again.";
      return false;
    }
  }

  async function completeSignup() {
    if (formStatus === FormStatus.LOADING) return;

    showDetailsDialog = false;

    // Submit updated information
    const success = await submitToAPI(true);

    if (success) {
      // Redirect after brief delay
      setTimeout(() => {
        goto('/welcome');
      }, 1000);
    }
  }

  function skipDetails() {
    showDetailsDialog = false;
    // Just redirect, email already submitted
    goto('/welcome');
  }

  function resetForm() {
    showDetailsDialog = false;
    email = "";
    postcode = "";
    firstName = "";
    lastName = "";
    phone = "";
    formStatus = FormStatus.READY;
    errorMessage = "";
  }
</script>

<section class="hero">
  <!-- Background Images -->
  <div class="hero__images">
    {#each images as img, i}
      <img
        src={img}
        alt="GetUp community members"
        class="hero__image"
        class:hero__image--active={i === activeIndex}
        loading={i === 0 ? "eager" : "lazy"}
      />
    {/each}
    <Ticker className="hero__ticker hero__ticker--mobile" />
    <Ticker className="hero__ticker hero__ticker--desktop" />
  </div>

  <!-- Content -->
  <div class="hero__content">
    <h1 class="hero__title font-header">
      {@html title}
    </h1>

    <p class="hero__description">
      {description}
    </p>

    {#if ctaType === "buttons"}
      <!-- Button CTAs -->
      <div class="hero__buttons">
        {#if primary}
          <a href={primary.url || primary.path} class="hero__btn hero__btn--primary u-arrow">
            {primary.label}
          </a>
        {/if}
        {#if secondary}
          <a href={secondary.url || secondary.path} class="hero__btn hero__btn--secondary">
            {secondary.label}
          </a>
        {/if}
      </div>
    {:else}
      <!-- Signup Form -->
      <form class="hero__form" onsubmit={handleSubmit} autocomplete="off" data-lpignore="true">
        <div class="hero__form-row">
          <div class="hero__field hero__field--email">
            <input
              id="hero-email"
              type="email"
              bind:value={email}
              placeholder="Email"
              required
              disabled={formStatus === FormStatus.LOADING}
              class="hero__input"
              autocomplete="off"
            />
          </div>

          <div class="hero__field hero__field--submit">
            <button
              type="submit"
              class="hero__submit"
              aria-label="Join GetUp"
              disabled={formStatus === FormStatus.LOADING}
            >
              {#if formStatus === FormStatus.LOADING}
                <span class="hero__submit-spinner">⏳</span>
              {:else}
                <span class="hero__submit-text">Join</span>
                <span class="hero__submit-arrow">→</span>
              {/if}
            </button>
          </div>
        </div>

        <!-- Status Messages -->
        {#if formStatus === FormStatus.ERROR || formStatus === FormStatus.THROTTLED}
          <div class="hero__message hero__message--error">
            {errorMessage}
          </div>
        {/if}
      </form>
    {/if}
  </div>
</section>

<!-- Details Dialog -->
{#if showDetailsDialog}
  <div class="dialog-backdrop" role="button" tabindex="0" onclick={() => (showDetailsDialog = false)} onkeydown={(e) => e.key === 'Escape' && (showDetailsDialog = false)}>
    <div class="dialog" role="dialog" onclick={(e) => e.stopPropagation()}>
      <div class="dialog__header">
        <h2 class="dialog__title">Almost there!</h2>
        <button class="dialog__close" onclick={() => (showDetailsDialog = false)} aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="dialog__description">
        Help us personalize your GetUp experience by sharing a bit more about yourself (optional).
      </p>

      <form class="dialog__form" onsubmit={(e) => { e.preventDefault(); completeSignup(); }}>
        <div class="dialog__field">
          <input
            id="dialog-firstName"
            type="text"
            bind:value={firstName}
            placeholder="First name"
            class="dialog__input"
          />
        </div>

        <div class="dialog__field">
          <input
            id="dialog-lastName"
            type="text"
            bind:value={lastName}
            placeholder="Last name"
            class="dialog__input"
          />
        </div>

        <div class="dialog__field">
          <input
            id="dialog-postcode"
            type="text"
            bind:value={postcode}
            placeholder="Postcode"
            maxlength="4"
            class="dialog__input"
          />
        </div>

        <div class="dialog__field">
          <input
            id="dialog-phone"
            type="tel"
            bind:value={phone}
            placeholder="Phone number"
            class="dialog__input"
          />
        </div>

        <div class="dialog__actions">
          <button type="button" class="dialog__btn dialog__btn--skip" onclick={skipDetails}>Skip</button>
          <button type="submit" class="dialog__btn dialog__btn--submit">Complete</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Hero Section */
  .hero {
    display: flex;
    flex-direction: column;
    min-height: 60vh;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .hero {
      flex-direction: row;
      min-height: 600px;
    }
  }

  /* Images */
  .hero__images {
    position: relative;
    height: 220px;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    .hero__images {
      order: 2;
      width: 45%;
      height: auto;
    }
  }

  @media (min-width: 1024px) {
    .hero__images {
      width: 55%;
    }
  }

  .hero__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    opacity: 0;
    transition: opacity 1s ease;
  }

  .hero__image--active {
    opacity: 1;
  }

  /* Content */
  .hero__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-6, 1.5rem);
    background: var(--color-orange, #fc661f);
    color: var(--color-white, #fff);
  }

  @media (min-width: 768px) {
    .hero__content {
      order: 1;
      width: 55%;
      padding: var(--space-12, 3rem);
      gap: var(--space-2, 0.5rem);
    }
  }

  @media (min-width: 1024px) {
    .hero__content {
      width: 45%;
    }
  }

  .hero__title {
    font-size: clamp(2.5rem, 8vw, 5rem);
    line-height: 1;
    margin: 0;
  }

  @media (min-width: 768px) {
    .hero__title {
      font-size: clamp(3rem, 6vw, 6rem);
    }
  }

  .hero__description {
    font-size: var(--text-lg, 1.25rem);
    line-height: var(--leading-snug, 1.25);
    max-width: 24rem;
    margin: 0;
  }

  @media (min-width: 768px) {
    .hero__description {
      font-size: var(--text-2xl, 1.875rem);
      max-width: none;
    }
  }

  /* Buttons */
  .hero__buttons {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
    width: 100%;
    max-width: 24rem;
    margin-top: var(--space-4, 1rem);
  }

  @media (min-width: 768px) {
    .hero__buttons {
      flex-direction: row;
      justify-content: center;
      max-width: none;
      margin-top: var(--space-8, 2rem);
    }
  }

  .hero__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    padding: 0 var(--space-6, 1.5rem);
    font-family: var(--font-sans);
    font-weight: var(--font-extrabold, 800);
    font-size: var(--text-sm, 0.875rem);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: var(--radius-sm, 4px);
    transition: background-color var(--duration-fast, 150ms) var(--ease-out);
    text-decoration: none;
  }

  @media (min-width: 768px) {
    .hero__btn {
      height: 3.5rem;
      font-size: var(--text-lg, 1.25rem);
      padding: 0 var(--space-8, 2rem);
    }
  }

  .hero__btn--primary {
    background: var(--color-purple, #4a47d6);
    color: var(--color-white, #fff);
  }

  .hero__btn--primary:hover {
    background: var(--color-purple-dark, #3d3ab8);
  }

  .hero__btn--secondary {
    background: transparent;
    color: var(--color-white, #fff);
    border: 2px solid var(--color-white, #fff);
  }

  .hero__btn--secondary:hover {
    background: var(--color-white, #fff);
    color: var(--color-orange, #fc661f);
  }

  /* Form */
  .hero__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
    width: 100%;
    max-width: 24rem;
    margin-top: var(--space-4, 1rem);
  }

  @media (min-width: 768px) {
    .hero__form {
      max-width: 32rem;
      margin-top: var(--space-6, 1.5rem);
    }
  }

  .hero__form-row {
    display: flex;
    gap: var(--space-2, 0.5rem);
  }

  .hero__field {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  .hero__field--email {
    flex: 1;
  }

  .hero__field--submit {
    flex: 0 0 auto;
  }

  .hero__input {
    width: 100%;
    height: 3rem;
    padding: 0 var(--space-4, 1rem);
    font-family: var(--font-sans);
    font-size: var(--text-base, 1rem);
    color: var(--color-slate, #26262d);
    background: var(--color-white, #fff);
    border: 1px solid var(--color-slate-300, #8a8c94);
    border-radius: var(--radius-sm, 4px);
    transition: border-color var(--duration-fast, 150ms) var(--ease-out);
  }

  @media (min-width: 768px) {
    .hero__input {
      height: 3.5rem;
      font-size: var(--text-lg, 1.25rem);
      background: var(--color-sand, #f1efe0);
    }
  }

  .hero__input:focus {
    outline: none;
    border-color: var(--color-purple, #4a47d6);
    box-shadow: 0 0 0 3px rgba(74, 71, 214, 0.2);
  }

  .hero__input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .hero__input::placeholder {
    color: var(--color-slate-300, #8a8c94);
  }

  .hero__submit {
    flex-shrink: 0;
    height: 3rem;
    width: 3rem;
    padding: 0;
    background: var(--color-purple, #4a47d6);
    color: var(--color-white, #fff);
    font-family: var(--font-sans);
    font-weight: var(--font-extrabold, 800);
    font-size: var(--text-sm, 0.875rem);
    text-transform: uppercase;
    border: none;
    border-radius: var(--radius-sm, 4px);
    cursor: pointer;
    transition: background-color var(--duration-fast, 150ms) var(--ease-out);
  }

  @media (min-width: 768px) {
    .hero__submit {
      height: 3.5rem;
      width: 3.5rem;
    }
  }

  @media (min-width: 1024px) {
    .hero__submit {
      width: 4rem;
    }
  }

  .hero__submit:hover:not(:disabled) {
    background: var(--color-purple-dark, #3d3ab8);
  }

  .hero__submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .hero__submit-text {
    display: none;
  }

  .hero__submit-arrow {
    display: inline;
    font-size: var(--text-xl, 1.5rem);
  }

  .hero__submit-spinner {
    display: inline;
    font-size: var(--text-xl, 1.5rem);
  }

  /* Messages */
  .hero__message {
    padding: var(--space-3, 0.75rem);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-semibold, 600);
    text-align: center;
  }

  .hero__message--success {
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-white, #fff);
  }

  .hero__message--error {
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-white, #fff);
  }

  /* Ticker - must be :global() since classes are on child component */
  :global(.hero__ticker--mobile) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }

  @media (min-width: 768px) {
    :global(.hero__ticker--mobile) {
      display: none;
    }
  }

  :global(.hero__ticker--desktop) {
    display: none;
  }

  @media (min-width: 768px) {
    :global(.hero__ticker--desktop) {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 20;
    }
  }

  /* Dialog */
  .dialog-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--z-modal-backdrop, 400);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4, 1rem);
  }

  .dialog {
    background: var(--color-white, #fff);
    border-radius: var(--radius-lg, 12px);
    box-shadow: var(--shadow-xl);
    max-width: 28rem;
    width: 100%;
    padding: var(--space-6, 1.5rem);
  }

  .dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-4, 1rem);
  }

  .dialog__title {
    font-size: var(--text-2xl, 1.875rem);
    font-weight: var(--font-bold, 700);
    color: var(--color-slate, #26262d);
    margin: 0;
  }

  .dialog__close {
    background: none;
    border: none;
    color: var(--color-slate-300, #8a8c94);
    cursor: pointer;
    padding: 0;
  }

  .dialog__close:hover {
    color: var(--color-slate, #26262d);
  }

  .dialog__description {
    color: var(--color-slate-200, #5a5c66);
    margin-bottom: var(--space-6, 1.5rem);
  }

  .dialog__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 1rem);
  }

  .dialog__field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .dialog__input {
    height: 3rem;
    padding: 0 var(--space-3, 0.75rem);
    font-family: var(--font-sans);
    font-size: var(--text-base, 1rem);
    color: var(--color-slate, #26262d);
    background: var(--color-white, #fff);
    border: 1px solid var(--color-slate-300, #8a8c94);
    border-radius: var(--radius-md, 8px);
  }

  .dialog__input:focus {
    outline: none;
    border-color: var(--color-purple, #4a47d6);
    box-shadow: 0 0 0 3px rgba(74, 71, 214, 0.15);
  }

  .dialog__input::placeholder {
    color: var(--color-slate-300, #8a8c94);
  }

  .dialog__actions {
    display: flex;
    gap: var(--space-3, 0.75rem);
    margin-top: var(--space-4, 1rem);
  }

  .dialog__btn {
    flex: 1;
    height: 3rem;
    font-family: var(--font-sans);
    font-weight: var(--font-semibold, 600);
    border: none;
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    transition: background-color var(--duration-fast, 150ms) var(--ease-out);
  }

  .dialog__btn--skip {
    background: var(--color-sand-dark, #e5e3d4);
    color: var(--color-slate, #26262d);
  }

  .dialog__btn--skip:hover {
    background: var(--color-slate-300, #8a8c94);
  }

  .dialog__btn--submit {
    background: var(--color-purple, #4a47d6);
    color: var(--color-white, #fff);
  }

  .dialog__btn--submit:hover {
    background: var(--color-purple-dark, #3d3ab8);
  }

  /* White underline variant */
  :global(.u-underlined--white)::after {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 534.6 106' preserveAspectRatio='none'%3E%3Cpath fill='%23ffffff' d='M42.6,77.5c-.4-1.6-1.7.2-2.4,0-.4,0-.5-.9-1.1-.7l-.2,1.3s3.7-.5,3.7-.5ZM44.9,75.2c-.7-.3-3.5.3-2.8,1.3.6.8,2.7-.2,2.8-1.3M64.7,77.4c-2.2.3-1.5-.5-1.9-.9-.5-.6-1.6,2.8,1.3,1.5.3-.2.7.3.6-.6M54.3,73.7l-1.6-.2-.2,1.9c.9.4.7-.4.8-.5,0,0,.9.5,1.3,0,0-.2-1.2-.2-.2-1.1'/%3E%3C/svg%3E");
  }
</style>
