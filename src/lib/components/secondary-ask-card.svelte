<script>
  import { renderMarkdown } from "$lib/utils/markdown";

  let { data, variant = "light", isMobile = false } = $props();

  const title = data?.title || data?.heading || "Join the GetUp crew!";
  const excerpt = data?.excerpt || "";
  const body = data?.body || "";
  const link = data?.link || "/donate/crew";
  const button = data?.ctaLabel || data?.button || "Step up. Power change.";

  const isDark = variant === "dark";
</script>

<a href={link} class="secondary-ask" class:secondary-ask--mobile={isMobile}>
  <div class="secondary-ask__inner">
    <div class="secondary-ask__content">
      <h3 class="secondary-ask__title">{title}</h3>

      {#if excerpt}
        <p class="secondary-ask__excerpt">{excerpt}</p>
      {/if}

      {#if body}
        <div class="secondary-ask__body">
          {@html renderMarkdown(isMobile ? body.split("\n\n")[0] || body : body)}
        </div>
      {/if}
    </div>

    <div class="secondary-ask__cta">
      <span>{button}</span>
      <span class="secondary-ask__arrow">→</span>
    </div>
  </div>
</a>

<style>
  .secondary-ask {
    display: block;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  .secondary-ask__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-sand, #f5f3eb);
    border-radius: var(--radius-sm, 4px);
    overflow: hidden;
    transition: transform var(--duration-fast, 150ms) var(--ease-out, ease-out),
                box-shadow var(--duration-fast, 150ms) var(--ease-out, ease-out);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  }

  .secondary-ask:hover .secondary-ask__inner {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
  }

  .secondary-ask__content {
    flex: 1;
    padding: var(--space-5, 1.25rem) var(--space-6, 1.5rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .secondary-ask__title {
    font-family: var(--font-subheader);
    font-weight: var(--font-extrabold, 800);
    font-size: var(--text-2xl, 1.5rem);
    line-height: var(--leading-tight, 1.1);
    color: var(--color-orange, #fc661f);
    text-transform: uppercase;
    margin: 0 0 var(--space-3, 0.75rem) 0;
  }

  .secondary-ask__excerpt {
    font-size: var(--text-base, 1rem);
    color: var(--color-slate, #26262d);
    line-height: var(--leading-relaxed, 1.625);
    margin: 0 0 var(--space-3, 0.75rem) 0;
  }

  .secondary-ask__body {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-slate-200, #5a5c66);
    line-height: var(--leading-relaxed, 1.625);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  .secondary-ask--mobile .secondary-ask__body {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }

  .secondary-ask__cta {
    display: flex;
    align-items: center;
    justify-content: center;
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

  .secondary-ask:hover .secondary-ask__cta {
    background: var(--color-orange-dark, #e55a18);
  }

  .secondary-ask__arrow {
    transition: transform var(--duration-fast, 150ms) var(--ease-out, ease-out);
  }

  .secondary-ask:hover .secondary-ask__arrow {
    transform: translateX(4px);
  }

  @media (min-width: 768px) {
    .secondary-ask__title {
      font-size: var(--text-3xl, 1.875rem);
    }

    .secondary-ask__cta {
      font-size: var(--text-base, 1rem);
      padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
    }
  }
</style>
