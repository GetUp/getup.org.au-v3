<script>
  /**
   * CampaignCard - A unified card component for campaigns
   *
   * Variants:
   * - "featured" (default): Bold purple card with orange CTA, for hero/primary campaigns
   * - "compact": White card with image on top, for secondary listings
   *
   * @prop {Object} campaign - Campaign data with title, image, excerpt, href/link/path
   * @prop {"featured" | "compact"} variant - Card style variant
   * @prop {string} className - Additional CSS classes
   */
  let {
    campaign,
    variant = "featured",
    className = "",
  } = $props();

  // Extract campaign data with fallbacks
  const href = campaign?.href || campaign?.link || campaign?.path || "#";
  const title = campaign?.title || campaign?.heading || "Untitled campaign";
  const image = campaign?.image;
  const excerpt = campaign?.excerpt || campaign?.description;

  // External link handling (SSR-safe)
  const hostname = typeof window !== "undefined" ? window.location?.hostname : "";
  const isExternal = /^https?:\/\//.test(href) && !href.includes(hostname || "");
  const target = isExternal ? "_blank" : undefined;
  const rel = isExternal ? "noopener noreferrer" : undefined;

  // Variant flags
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
</script>

<a
  {href}
  {target}
  {rel}
  class="campaign-card group block h-full {className}"
  class:campaign-card--featured={isFeatured}
  class:campaign-card--compact={isCompact}
>
  <article class="campaign-card__inner">
    {#if isCompact}
      <!-- Compact variant: Image first, then content -->
      <div class="campaign-card__image-wrapper">
        {#if image}
          <img
            src={image}
            alt=""
            class="campaign-card__image"
            loading="lazy"
          />
        {:else}
          <div class="campaign-card__image-placeholder"></div>
        {/if}
      </div>

      <div class="campaign-card__content">
        <h3 class="campaign-card__title">{title}</h3>
        {#if excerpt}
          <p class="campaign-card__excerpt">{excerpt}</p>
        {/if}
      </div>

      <div class="campaign-card__cta campaign-card__cta--text">
        <span>Read more</span>
        <span class="campaign-card__arrow">→</span>
      </div>
    {:else}
      <!-- Featured variant: Title, image in polaroid, excerpt, bold CTA -->
      <div class="campaign-card__content">
        <h3 class="campaign-card__title">{title}</h3>

        <div class="campaign-card__polaroid">
          {#if image}
            <img
              src={image}
              alt=""
              class="campaign-card__image"
              loading="lazy"
            />
          {:else}
            <div class="campaign-card__image-placeholder"></div>
          {/if}
        </div>

        {#if excerpt}
          <p class="campaign-card__excerpt">{excerpt}</p>
        {/if}
      </div>

      <div class="campaign-card__cta campaign-card__cta--button">
        <span class="campaign-card__scribble"></span>
        <span>Take action</span>
        <span class="campaign-card__arrow">→</span>
      </div>
    {/if}
  </article>
</a>

<style>
  /* Base card styles */
  .campaign-card {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .campaign-card__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: var(--radius-sm, 4px);
    overflow: hidden;
    transition: transform var(--duration-fast, 150ms) var(--ease-out, ease-out),
                box-shadow var(--duration-fast, 150ms) var(--ease-out, ease-out);
  }

  .campaign-card:hover .campaign-card__inner {
    transform: translateY(-2px);
  }

  /* Featured variant */
  .campaign-card--featured .campaign-card__inner {
    background: var(--color-purple, #4a47d6);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  }

  .campaign-card--featured:hover .campaign-card__inner {
    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
  }

  .campaign-card--featured .campaign-card__content {
    padding: var(--space-5, 1.25rem) var(--space-6, 1.5rem);
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .campaign-card--featured .campaign-card__title {
    font-family: var(--font-sans);
    font-weight: var(--font-extrabold, 800);
    font-size: var(--text-xl, 1.5rem);
    line-height: var(--leading-tight, 1.1);
    color: var(--color-white, #fff);
    text-transform: uppercase;
    margin-bottom: var(--space-3, 0.75rem);
    min-height: 3.5rem;
  }

  @media (min-width: 768px) {
    .campaign-card--featured .campaign-card__title {
      font-size: var(--text-2xl, 1.875rem);
      min-height: 4rem;
    }
  }

  .campaign-card--featured .campaign-card__polaroid {
    background: var(--color-white, #fff);
    padding: var(--space-2, 0.5rem);
    border-radius: var(--radius-sm, 4px);
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
    transform: rotate(-1deg);
    transition: transform var(--duration-fast, 150ms) var(--ease-out, ease-out);
    margin-bottom: var(--space-3, 0.75rem);
    overflow: hidden;
  }

  .campaign-card--featured .campaign-card__polaroid .campaign-card__image,
  .campaign-card--featured .campaign-card__polaroid .campaign-card__image-placeholder {
    aspect-ratio: 4/3;
    object-fit: cover;
  }

  .campaign-card--featured:hover .campaign-card__polaroid {
    transform: rotate(0deg);
  }

  .campaign-card--featured .campaign-card__excerpt {
    font-size: var(--text-sm, 0.875rem);
    color: rgba(255, 255, 255, 0.9);
    line-height: var(--leading-relaxed, 1.625);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .campaign-card--featured .campaign-card__cta--button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2, 0.5rem);
    background: var(--color-orange, #fc661f);
    color: var(--color-white, #fff);
    padding: var(--space-3, 0.75rem) var(--space-5, 1.25rem);
    font-family: var(--font-sans);
    font-weight: var(--font-extrabold, 800);
    font-size: var(--text-sm, 0.875rem);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    transition: background-color var(--duration-fast, 150ms) var(--ease-out, ease-out);
  }

  @media (min-width: 768px) {
    .campaign-card--featured .campaign-card__cta--button {
      font-size: var(--text-base, 1rem);
      padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
    }
  }

  .campaign-card--featured:hover .campaign-card__cta--button {
    background: var(--color-orange-dark, #e55a18);
  }

  /* Compact variant */
  .campaign-card--compact .campaign-card__inner {
    background: var(--color-white, #fff);
    border: 2px solid var(--color-slate-300, #8a8c94);
  }

  .campaign-card--compact .campaign-card__image-wrapper {
    aspect-ratio: 4/3;
    overflow: hidden;
  }

  .campaign-card--compact .campaign-card__content {
    padding: var(--space-4, 1rem) var(--space-5, 1.25rem);
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .campaign-card--compact .campaign-card__title {
    font-family: var(--font-sans);
    font-weight: var(--font-bold, 700);
    font-size: var(--text-lg, 1.25rem);
    line-height: var(--leading-snug, 1.25);
    color: var(--color-slate, #26262d);
    margin-bottom: var(--space-2, 0.5rem);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.5rem;
  }

  .campaign-card--compact .campaign-card__excerpt {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-slate-200, #5a5c66);
    line-height: var(--leading-relaxed, 1.625);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .campaign-card--compact .campaign-card__cta--text {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-1, 0.25rem);
    padding: var(--space-3, 0.75rem) var(--space-5, 1.25rem);
    font-family: var(--font-sans);
    font-weight: var(--font-semibold, 600);
    font-size: var(--text-sm, 0.875rem);
    text-transform: uppercase;
    color: var(--color-orange, #fc661f);
    transition: color var(--duration-fast, 150ms) var(--ease-out, ease-out);
  }

  .campaign-card--compact:hover .campaign-card__cta--text {
    color: var(--color-orange-dark, #e55a18);
  }

  /* Shared image styles */
  .campaign-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--duration-normal, 250ms) var(--ease-out, ease-out);
  }

  .campaign-card:hover .campaign-card__image {
    transform: scale(1.05);
  }

  .campaign-card__image-placeholder {
    width: 100%;
    height: 100%;
    background: var(--color-sand-dark, #e5e3d4);
    aspect-ratio: 4/3;
  }

  /* Arrow animation */
  .campaign-card__arrow {
    transition: transform var(--duration-fast, 150ms) var(--ease-out, ease-out);
  }

  .campaign-card:hover .campaign-card__arrow {
    transform: translateX(4px);
  }

  /* Scribble decoration */
  .campaign-card__scribble {
    width: 80px;
    height: 8px;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg id='a' xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 534.6 106' preserveAspectRatio='none'%3E%3Cpath fill='%23fc661f' d='M42.6,77.5c-.4-1.6-1.7.2-2.4,0-.4,0-.5-.9-1.1-.7l-.2,1.3s3.7-.5,3.7-.5ZM44.9,75.2c-.7-.3-3.5.3-2.8,1.3.6.8,2.7-.2,2.8-1.3M64.7,77.4c-2.2.3-1.5-.5-1.9-.9-.5-.6-1.6,2.8,1.3,1.5.3-.2.7.3.6-.6M54.3,73.7l-1.6-.2-.2,1.9c.9.4.7-.4.8-.5,0,0,.9.5,1.3,0,0-.2-1.2-.2-.2-1.1'/%3E%3C/svg%3E");
    flex-shrink: 0;
  }
</style>
