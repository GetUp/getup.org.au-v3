<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import CampaignCard from "$lib/components/campaign-card.svelte";
  import LogoMarkExclaim from "$lib/components/logo-mark-exclaim.svelte";
  import SidebarSubmenu from "$lib/components/sidebar-submenu.svelte";
  import { campaigns as rootCampaigns, pillars } from "$lib/data/content";

  const baseHref = "/campaigns";
  const campaignList = rootCampaigns.filter((campaign) => !campaign.archived);
  let searchTerm = $state("");
  let activeCategorySlug = $state("");
  const pillarSlugs = [...pillars.filter((p) => p.slug !== "all").map((p) => p.slug), "core", "featured"];

  const applyHashCategory = (hashValue?: string) => {
    const hashSlug = (hashValue || (typeof window !== "undefined" ? window.location.hash : "") || "").replace(
      "#",
      ""
    );
    if (hashSlug) {
      activeCategorySlug = hashSlug;
    }
  };

  $effect(() => {
    searchTerm = $page.url.searchParams.get("q") ?? "";
    applyHashCategory($page.url.hash);
    if (!activeCategorySlug) activeCategorySlug = "featured";
  });

  const handleSearchEvent = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    searchTerm = typeof detail === "string" ? detail : "";
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("campaign-search", handleSearchEvent);
    const hashHandler = () => applyHashCategory(window.location.hash);
    window.addEventListener("hashchange", hashHandler);
    hashHandler();
    return () => {
      window.removeEventListener("campaign-search", handleSearchEvent);
      window.removeEventListener("hashchange", hashHandler);
    };
  });

  const normalized = (value: string | undefined) => (value || "").toLowerCase();
  const formatBlurb = (text: string | undefined) => {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (!clean) return "See current actions and wins from our movement.";
    return clean.length > 120 ? `${clean.slice(0, 117)}...` : clean;
  };
  const filteredCampaignList = $derived(
    searchTerm.trim()
      ? campaignList.filter((c) => {
          const q = normalized(searchTerm);
          return (
            normalized(c.title).includes(q) ||
            normalized(c.excerpt).includes(q) ||
            normalized(c.slug).includes(q) ||
            normalized(c.pillar).includes(q)
          );
        })
      : campaignList
  );
  const searchResults = $derived(filteredCampaignList);
  const hasSearch = $derived((searchTerm || "").trim().length > 0);

  const pillarBuckets = $derived(
    filteredCampaignList.reduce<Record<string, typeof filteredCampaignList>>((acc, campaign) => {
      const key = campaign.pillar || "core";
      if (!acc[key]) acc[key] = [];
      acc[key].push(campaign);
      return acc;
    }, {})
  );

  const coreCampaigns = $derived(pillarBuckets["core"] || []);
  const featuredCampaignsOnly = $derived(
    filteredCampaignList.filter((c) => c.status === "featured" || c.status === "top" || c.featured)
  );

  const pillarCategories = $derived(
    pillars
      .filter((pillar) => pillar.slug !== "all")
      .map((pillar) => {
        const campaigns = pillarBuckets[pillar.slug] || [];
        const examples = campaigns.slice(0, 3).map((c) => c.title).filter(Boolean);
        return {
          slug: pillar.slug,
          heading: pillar.heading || pillar.slug.replace(/-/g, " "),
          description:
            examples.length > 0
              ? `Includes: ${examples.join(", ")}`
              : pillar.subhead || "",
          blurb: formatBlurb(
            examples.length > 0
              ? `Includes: ${examples.join(", ")}`
              : pillar.subhead || ""
          ),
          image: pillar.image,
          campaigns,
          icon: pillar.slug,
          iconFile: pillar.iconFile,
        };
      })
  );

  const categories = $derived([
    {
      slug: "featured",
      heading: "Featured",
      description: "Priority campaigns to take action on now (Featured or Top).",
      image: featuredCampaignsOnly[0]?.image,
      campaigns: featuredCampaignsOnly,
      icon: "star",
      iconFile: undefined,
      blurb: formatBlurb("Priority campaigns to take action on now."),
    },
    {
      slug: "core",
      heading: "Core",
      description: "Key campaigns that express GetUp's values and priorities.",
      image: undefined,
      campaigns: coreCampaigns,
      icon: "core",
      iconFile: undefined,
      blurb: formatBlurb("Key campaigns that express GetUp's values and priorities."),
    },
    ...pillarCategories,
  ]);

  const activeCategory = $derived(() => categories.find((c) => c.slug === activeCategorySlug) || categories[0]);
  const activeCampaigns = $derived(() => {
    if (activeCategory?.slug === "featured") return featuredCampaignsOnly;
    if (activeCategory?.slug === "core") return coreCampaigns;
    if (pillarBuckets[activeCategorySlug ?? ""]) return pillarBuckets[activeCategorySlug] || [];
    return activeCategory?.campaigns || [];
  });
  const heroBackground = $derived(activeCategory?.image);
  const heroHeading = $derived(activeCategory?.heading || "Campaigns");
  const heroSubhead = $derived(
    activeCategory?.description ||
      "Our movement's agenda set by our members push for tangible, positive change. Call on decision-makers to deliver action on the issues we care about."
  );

  const featuredCampaigns = $derived(
    [...filteredCampaignList]
      .filter((c) => c.status === "featured" || c.status === "top" || c.featured)
      .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
      .slice(0, 4)
  );

  const selectCategory = (slug: string) => {
    activeCategorySlug = slug;
    if (pillarSlugs.includes(slug)) {
      goto(`${baseHref}/${slug}`);
      return;
    }
    const target = `${baseHref}#${slug}`;
    goto(target, { replaceState: true, noScroll: true });
  };
</script>

<svelte:head>
  <title>Campaigns - GetUp</title>
  <meta
    name="description"
    content="Join our campaigns fighting for climate action, economic fairness, human rights, and democracy."
  />
</svelte:head>

<main class="campaigns-page page-main">
  <section id="campaigns-header" class="campaigns-hero page-hero">
    <div class="page-hero__overlay">
      {#if heroBackground}
        <div
          class="campaigns-hero__background"
          style={`background-image: url(${heroBackground});`}
        ></div>
      {/if}
      <div class="campaigns-hero__gradient"></div>
    </div>
    <div class="page-hero__content">
      <div class="campaigns-hero__text">
        <h1 class="campaigns-hero__title">
          {heroHeading}
        </h1>
        <p class="campaigns-hero__subhead">
          {heroSubhead}
        </p>
      </div>
    </div>
  </section>

  <section class="campaigns-content">
    <div class="campaigns-content__container">
      <div class="campaigns-content__layout">
        <div class="campaigns-content__sidebar">
          <SidebarSubmenu
            items={[
              {
                label: "Campaigns",
                href: baseHref,
                icon: "star",
                children: categories.map((c) => ({
                  label: c.heading,
                  href: pillarSlugs.includes(c.slug) ? `${baseHref}/${c.slug}` : `${baseHref}#${c.slug}`,
                  icon: c.icon,
                  iconFile: c.iconFile,
                })),
              },
            ]}
            mobileLayout="header"
            headerSelector="#campaigns-header"
            activeHref={$page.url.pathname + $page.url.hash}
          />
        </div>

        <div class="campaigns-content__main">
          {#if hasSearch}
            <div class="campaigns-search-results">
              <h2 class="campaigns-search-results__heading">
                Search results ({searchResults.length})
              </h2>
              {#if searchResults.length === 0}
                <p class="campaigns-search-results__empty">No campaigns match this search.</p>
              {:else}
                <div class="campaigns-search-results__grid">
                  {#each searchResults as campaign (campaign.slug || campaign.href || campaign.title)}
                    <CampaignCard campaign={campaign} variant="compact" />
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <div class="campaigns-categories">
            {#each categories as category}
              <button
                type="button"
                class={`campaigns-category ${activeCategory.slug === category.slug ? 'campaigns-category--active' : ''}`}
                on:click={() => selectCategory(category.slug)}
                id={category.slug}
              >
                <div class="campaigns-category__header">
                  {#if category.icon === 'core'}
                    <div class="campaigns-category__icon campaigns-category__icon--core">
                      <LogoMarkExclaim class="campaigns-category__icon-svg" />
                    </div>
                  {:else if category.icon === 'star'}
                    <div class="campaigns-category__icon campaigns-category__icon--star">
                      <svg class="campaigns-category__icon-svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  {:else if category.iconFile}
                    <div class="campaigns-category__icon">
                      <img src={category.iconFile} alt="" class="campaigns-category__icon-img" />
                    </div>
                  {:else if category.image}
                    <img src={category.image} alt={category.heading} class="campaigns-category__image" loading="lazy" />
                  {/if}
                  <div class="campaigns-category__title-wrap">
                    <p class="campaigns-category__title">{category.heading}</p>
                  </div>
                </div>
                <p class="campaigns-category__description">
                  {category.blurb || category.description}
                </p>
              </button>
            {/each}
          </div>

          {#if featuredCampaigns.length && activeCategory.slug === 'featured'}
            <div class="campaigns-featured">
              <h2 class="campaigns-featured__heading">Featured campaigns</h2>
              <div class="campaigns-featured__grid">
                {#each featuredCampaigns as campaign (campaign.slug || campaign.href || campaign.title)}
                  <a
                    href={campaign.href}
                    class="campaigns-featured-card"
                  >
                    {#if campaign.image}
                      <div class="campaigns-featured-card__image-wrap">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          class="campaigns-featured-card__image"
                          loading="lazy"
                        />
                      </div>
                    {/if}
                    <div class="campaigns-featured-card__content">
                      <h3 class="campaigns-featured-card__title">
                        {campaign.title}
                      </h3>
                    </div>
                  </a>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  /* ==========================================================================
     Campaigns Page Styles
     ========================================================================== */

  /* Hero Section */
  .campaigns-hero {
    background: var(--color-orange);
  }

  .campaigns-hero__background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .campaigns-hero__gradient {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(252, 102, 31, 0.7),
      rgba(252, 102, 31, 0.6),
      rgba(252, 102, 31, 0.7)
    );
  }

  .campaigns-hero__text {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .campaigns-hero__title {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 6vw, var(--text-6xl));
    font-weight: var(--font-normal);
    line-height: var(--leading-tight);
    color: var(--color-white);
  }

  .campaigns-hero__subhead {
    font-size: clamp(var(--text-lg), 2vw, var(--text-xl));
    max-width: 48rem;
    color: var(--color-white);
  }

  /* Content Section */
  .campaigns-content {
    padding: var(--space-10) var(--space-4);
  }

  @media (min-width: 1024px) {
    .campaigns-content {
      padding: var(--space-14) var(--space-4);
    }
  }

  .campaigns-content__container {
    width: min(var(--container-xl), 100%);
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .campaigns-content__container {
      padding-inline: var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    .campaigns-content__container {
      padding-inline: var(--space-8);
    }
  }

  .campaigns-content__layout {
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
  }

  @media (min-width: 1024px) {
    .campaigns-content__layout {
      flex-direction: row;
      gap: var(--space-12);
    }
  }

  .campaigns-content__sidebar {
    display: none;
  }

  @media (min-width: 1024px) {
    .campaigns-content__sidebar {
      display: block;
    }
  }

  .campaigns-content__main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  /* Search Results */
  .campaigns-search-results {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .campaigns-search-results__heading {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--color-slate);
  }

  .campaigns-search-results__empty {
    color: var(--color-slate-200);
  }

  .campaigns-search-results__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  @media (min-width: 640px) {
    .campaigns-search-results__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .campaigns-search-results__grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Categories Grid */
  .campaigns-categories {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  @media (min-width: 768px) {
    .campaigns-categories {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }
  }

  @media (min-width: 1024px) {
    .campaigns-categories {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .campaigns-category {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    text-align: left;
    background: var(--color-white);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  @media (min-width: 768px) {
    .campaigns-category {
      padding: var(--space-4);
    }
  }

  .campaigns-category:hover {
    box-shadow: var(--shadow-sm);
  }

  .campaigns-category--active {
    border-color: var(--color-orange);
    box-shadow: var(--shadow-md);
    background: rgba(252, 102, 31, 0.05);
  }

  .campaigns-category__header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .campaigns-category__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-md);
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
  }

  .campaigns-category__icon--core {
    color: var(--color-slate-400);
    background: rgba(0, 0, 0, 0.02);
  }

  .campaigns-category__icon--core .campaigns-category__icon-svg {
    width: 1.75rem;
    height: 1.75rem;
  }

  .campaigns-category__icon--star {
    color: var(--color-orange);
  }

  .campaigns-category__icon-svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .campaigns-category__icon-img {
    width: 1.5rem;
    height: 1.5rem;
  }

  .campaigns-category__image {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-md);
    object-fit: cover;
    border: 1px solid rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
  }

  .campaigns-category__title-wrap {
    flex: 1;
    min-width: 0;
  }

  .campaigns-category__title {
    font-family: var(--font-sans);
    font-weight: var(--font-extrabold);
    font-size: var(--text-lg);
    line-height: var(--leading-tight);
    color: var(--color-slate);
  }

  .campaigns-category__description {
    font-size: var(--text-sm);
    color: var(--color-slate-light);
    line-height: var(--leading-snug);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.8em;
  }

  /* Featured Campaigns */
  .campaigns-featured {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .campaigns-featured__heading {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--color-slate);
  }

  .campaigns-featured__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  @media (min-width: 768px) {
    .campaigns-featured__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .campaigns-featured-card {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: box-shadow var(--duration-fast) var(--ease-out);
  }

  .campaigns-featured-card:hover {
    box-shadow: var(--shadow-md);
  }

  .campaigns-featured-card__image-wrap {
    aspect-ratio: 4 / 3;
    background: rgba(0, 0, 0, 0.04);
    max-height: 14rem;
    overflow: hidden;
  }

  .campaigns-featured-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .campaigns-featured-card__content {
    padding: var(--space-4);
  }

  .campaigns-featured-card__title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-slate);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
