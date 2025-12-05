<script lang="ts">
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Logo from "./logo.svelte";
  import { pillars, navigationLinks, headerContent } from "$lib/data/content";

  let { onOpenSignup = () => {} } = $props();

  let mobileMenuOpen = $state(false);
  let searchQuery = $state("");

  $effect(() => {
    if ($page.url.pathname.startsWith("/campaigns")) {
      searchQuery = $page.url.searchParams.get("q") ?? "";
    }
  });

  const updateInPlace = (value: string) => {
    if (typeof window === "undefined") return;
    if (!$page.url.pathname.startsWith("/campaigns")) return;
    const params = new URLSearchParams($page.url.search);
    if (value.trim()) params.set("q", value);
    else params.delete("q");
    const newUrl = `${$page.url.pathname}${params.toString() ? `?${params.toString()}` : ""}${$page.url.hash}`;
    history.replaceState(history.state, "", newUrl);
    window.dispatchEvent(new CustomEvent("campaign-search", { detail: value }));
  };

  const submitSearch = (event?: Event) => {
    event?.preventDefault();
    const value = searchQuery.trim();
    if ($page.url.pathname.startsWith("/campaigns")) {
      updateInPlace(value);
    } else {
      const params = new URLSearchParams();
      if (value) params.set("q", value);
      goto(`/campaigns${params.toString() ? `?${params.toString()}` : ""}`, {
        replaceState: true,
        noScroll: true,
        keepfocus: true,
      });
    }
    mobileMenuOpen = false;
  };

  const campaignPillars = pillars.filter((pillar) => pillar.slug !== "all");

  const navList = (navigationLinks || []).map((item) => {
    if (item.label === "Campaigns") {
      return {
        path: item.page,
        label: item.label,
        subNavList: campaignPillars,
        external: item.external,
      };
    }
    return {
      path: item.page || item.url,
      label: item.label,
      external: item.external,
      target: item.target,
    };
  });

  // Fallback if navigationLinks empty (e.g. error loading)
  if (navList.length === 0) {
    navList.push(
      { path: "/campaigns", label: "Campaigns", subNavList: campaignPillars },
      { path: "/about", label: "About" },
      { path: "/reports", label: "Reports" }
    );
  }
</script>

<nav class="site-header">
  <div class="site-header__container">
    <!-- Desktop Navigation -->
    <div class="site-header__desktop">
      <div class="site-header__nav-left">
        <a href="/" class="site-header__logo">
          <Logo />
        </a>

        {#each navList as item}
          <div class="site-header__nav-item">
            <a
              href={item.path}
              target={item.target || (item.external ? "_blank" : undefined)}
              class="site-header__nav-link"
            >
              <span>{item.label}</span>
              {#if item.subNavList}
                <svg
                  class="site-header__nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              {/if}
            </a>

            {#if item.subNavList}
              <div class="site-header__dropdown">
                <a href="/campaigns" class="site-header__dropdown-item">
                  <div></div>
                  <div>
                    <p class="site-header__dropdown-title">All campaigns</p>
                    <p class="site-header__dropdown-desc">
                      Our movement's agenda set by our members push for
                      tangible, positive change
                    </p>
                  </div>
                </a>
                {#each item.subNavList as pillar}
                  <a
                    href={`/campaigns/${pillar.slug}`}
                    class="site-header__dropdown-item"
                  >
                    {#if pillar.iconFile}
                      <img
                        src={pillar.iconFile}
                        alt={`${pillar.heading} icon`}
                        class="site-header__dropdown-icon"
                        loading="lazy"
                      />
                    {/if}
                    <div>
                      <p class="site-header__dropdown-title">{pillar.heading}</p>
                      <p class="site-header__dropdown-desc">
                        {pillar.subhead}
                      </p>
                    </div>
                  </a>
                {/each}
                <a href="/campaigns" class="site-header__dropdown-link">
                  <p class="site-header__dropdown-link-text">
                    Show all campaigns
                    <svg
                      class="site-header__dropdown-arrow"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </p>
                </a>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <div class="site-header__nav-right">
        {#if headerContent.buttons && headerContent.buttons.length > 0}
          {#each headerContent.buttons as btn}
            <a
              href={btn.url || btn.page}
              target={btn.target || (btn.external ? "_blank" : undefined)}
              rel={btn.external ? "noopener noreferrer" : undefined}
              class={btn.style === "secondary"
                ? "site-header__action-link u-arrow"
                : "btn btn-sm btn-primary site-header__action-btn u-plus"}
            >
              {btn.label}
            </a>
          {/each}
        {:else}
          <a href="/donate" class="site-header__action-link u-arrow">
            Donate
          </a>
          <a
            href="https://petitions.getup.org.au/petition/start?source=unified-homepage"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm btn-primary site-header__action-btn u-plus"
          >
            Start petition
          </a>
        {/if}
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div class="site-header__mobile">
      <a href="/" class="site-header__logo">
        <Logo />
      </a>

      <div class="site-header__mobile-actions">
        <a href="/donate" class="site-header__mobile-link">
          Donate
        </a>
        <a
          href="https://petitions.getup.org.au"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-sm btn-primary site-header__mobile-btn u-plus"
        >
          Start petition
        </a>
      </div>

      <button
        type="button"
        class="site-header__menu-toggle"
        onclick={() => (mobileMenuOpen = true)}
      >
        <span class="sr-only">Open menu</span>
        <svg
          class="site-header__menu-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  {#if mobileMenuOpen}
    <button
      class="site-header__overlay"
      onclick={() => (mobileMenuOpen = false)}
      aria-label="Close menu"
    ></button>
    <div class="site-header__mobile-menu">
      <button
        type="button"
        class="site-header__close-btn"
        onclick={() => (mobileMenuOpen = false)}
      >
        <span class="sr-only">Close menu</span>
        <svg
          class="site-header__menu-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {#each navList as navItem}
        {#if navItem.subNavList}
          <p class="site-header__menu-label">{navItem.label}</p>
          <a
            href="/campaigns"
            class="site-header__menu-item"
            onclick={() => (mobileMenuOpen = false)}
          >
            <div></div>
            <div>
              <p>All campaigns</p>
            </div>
          </a>
          {#each navItem.subNavList as pillar}
            <a
              href={`/campaigns/${pillar.slug}`}
              class="site-header__menu-item"
              onclick={() => (mobileMenuOpen = false)}
            >
              {#if pillar.iconFile}
                <img
                  src={pillar.iconFile}
                  alt={`${pillar.heading} icon`}
                  class="site-header__menu-item-icon"
                  loading="lazy"
                />
              {/if}
              <div>
                <p>{pillar.heading}</p>
              </div>
            </a>
          {/each}
          <a
            href="/campaigns"
            class="site-header__menu-link"
            onclick={() => (mobileMenuOpen = false)}
          >
            <p class="site-header__menu-link-text">
              Show all campaigns
              <svg
                class="site-header__menu-arrow"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </p>
          </a>
          <hr class="site-header__menu-divider" />
        {:else}
          <div class="site-header__menu-nav-item">
            <a
              href={navItem.path}
              class="site-header__menu-nav-link"
              onclick={() => (mobileMenuOpen = false)}
            >
              <span>{navItem.label}</span>
            </a>
          </div>
        {/if}
      {/each}

      <form class="site-header__search-form" onsubmit={submitSearch}>
        <label class="sr-only" for="mobile-search">Search campaigns</label>
        <div class="site-header__search-wrapper">
          <input
            id="mobile-search"
            class="site-header__search-input"
            type="search"
            name="q"
            placeholder="Search campaigns"
            bind:value={searchQuery}
            oninput={(e) => updateInPlace(e.currentTarget?.value ?? "")}
          />
          <button type="submit" class="site-header__search-btn">
            <svg
              class="site-header__search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0011.15 11.15z"
              />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </form>

      <a
        href="https://petitions.getup.org.au"
        target="_blank"
        rel="noopener noreferrer"
        onclick={() => {
          mobileMenuOpen = false;
        }}
        class="btn btn-primary site-header__menu-primary-btn u-plus"
      >
        Start petition
      </a>
      <a
        href="/donate"
        onclick={() => {
          mobileMenuOpen = false;
        }}
        class="site-header__menu-donate-link"
      >
        Donate
      </a>
    </div>
  {/if}
</nav>

<style>
  /* ==========================================================================
     Site Header Component
     ========================================================================== */

  .site-header {
    position: relative;
    z-index: 50;
    background: var(--color-white);
    border-bottom: 2px solid var(--color-slate-100);
  }

  .site-header__container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 var(--space-4);
    height: 3.5rem;
    display: flex;
    align-items: center;
  }

  @media (min-width: 768px) {
    .site-header__container {
      padding: 0 var(--space-6);
    }
  }

  /* Logo */
  .site-header__logo {
    flex-shrink: 0;
    width: 84px;
    padding: 0 var(--space-1);
    display: flex;
    align-items: center;
  }

  /* Desktop Navigation */
  .site-header__desktop {
    display: none;
    justify-content: space-between;
    width: 100%;
    gap: var(--space-4);
  }

  @media (min-width: 768px) {
    .site-header__desktop {
      display: flex;
    }
  }

  .site-header__nav-left {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    font-weight: var(--font-medium);
  }

  @media (min-width: 1024px) {
    .site-header__nav-left {
      gap: var(--space-8);
    }
  }

  .site-header__nav-item {
    position: relative;
    display: flex;
    align-items: center;
  }

  .site-header__nav-link {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-4) 0;
    color: var(--color-slate);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .site-header__nav-link:hover {
    text-decoration: underline;
    color: var(--color-purple);
  }

  .site-header__nav-icon {
    width: 20px;
    height: 20px;
  }

  /* Dropdown Menu */
  .site-header__dropdown {
    display: none;
    position: absolute;
    z-index: 50;
    top: 3rem;
    left: calc(-1 * var(--space-6));
    width: 100vw;
    max-width: 28rem;
    background: var(--color-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--space-3) var(--space-6);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .site-header__nav-item:hover .site-header__dropdown {
    display: block;
  }

  .site-header__dropdown-item {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
    padding: var(--space-3);
    margin: 0 calc(-1 * var(--space-3));
    border-radius: var(--radius-lg);
    border: 1px solid transparent;
    text-decoration: none;
    color: var(--color-slate);
    transition: background-color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
  }

  .site-header__dropdown-item:hover {
    background: var(--color-slate-50);
    border-color: var(--color-slate-200);
  }

  .site-header__dropdown-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    margin-top: 2px;
  }

  .site-header__dropdown-title {
    font-weight: var(--font-medium);
  }

  .site-header__dropdown-desc {
    font-size: var(--text-sm);
    font-weight: var(--font-normal);
    color: var(--color-slate-400);
  }

  .site-header__dropdown-link {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
    align-items: flex-start;
    border-radius: var(--radius-lg);
    font-size: var(--text-sm);
    color: var(--color-purple);
    text-decoration: none;
  }

  .site-header__dropdown-link:hover {
    text-decoration: underline;
  }

  .site-header__dropdown-link-text {
    display: flex;
    align-items: center;
  }

  .site-header__dropdown-arrow {
    margin-left: var(--space-2);
    width: 16px;
    height: 16px;
  }

  /* Right Actions */
  .site-header__nav-right {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  @media (min-width: 1024px) {
    .site-header__nav-right {
      gap: var(--space-6);
    }
  }

  .site-header__action-link {
    white-space: nowrap;
    text-transform: uppercase;
    border-radius: var(--radius-md);
    font-family: var(--font-subheader);
    color: var(--color-slate);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .site-header__action-link:hover {
    color: var(--color-purple);
  }

  .site-header__action-btn {
    white-space: nowrap;
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
  }

  /* Mobile Navigation */
  .site-header__mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  @media (min-width: 768px) {
    .site-header__mobile {
      display: none;
    }
  }

  .site-header__mobile-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-left: auto;
    margin-right: var(--space-2);
  }

  .site-header__mobile-link {
    white-space: nowrap;
    font-size: var(--text-sm);
    text-transform: uppercase;
    font-family: var(--font-subheader);
    color: var(--color-slate);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .site-header__mobile-link:hover {
    text-decoration: underline;
    color: var(--color-purple);
  }

  .site-header__mobile-btn {
    white-space: nowrap;
    font-size: var(--text-sm);
    padding: var(--space-1) var(--space-2);
  }

  .site-header__menu-toggle {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .site-header__menu-icon {
    width: 24px;
    height: 24px;
  }

  /* Mobile Menu Overlay */
  .site-header__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    cursor: pointer;
  }

  .site-header__mobile-menu {
    position: fixed;
    height: auto;
    max-height: 95vh;
    top: var(--space-2);
    right: var(--space-2);
    left: var(--space-2);
    background: var(--color-white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--space-4);
    overflow-y: auto;
    z-index: 50;
  }

  .site-header__close-btn {
    display: flex;
    margin-left: auto;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  /* Mobile Menu Items */
  .site-header__menu-label {
    text-transform: uppercase;
    font-size: var(--text-sm);
    color: var(--color-slate-400);
  }

  .site-header__menu-item {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
    padding: var(--space-2) var(--space-3);
    margin: 0 calc(-1 * var(--space-3));
    border-radius: var(--radius-lg);
    border: 1px solid transparent;
    text-decoration: none;
    color: var(--color-slate);
    transition: background-color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
  }

  .site-header__menu-item:hover {
    background: var(--color-slate-50);
    border-color: var(--color-slate-200);
  }

  .site-header__menu-item-icon {
    margin-top: 2px;
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  .site-header__menu-link {
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
    margin-bottom: var(--space-4);
    align-items: flex-start;
    border-radius: var(--radius-lg);
    font-size: var(--text-sm);
    color: var(--color-purple);
    text-decoration: none;
  }

  .site-header__menu-link:hover {
    text-decoration: underline;
  }

  .site-header__menu-link-text {
    display: flex;
    align-items: center;
  }

  .site-header__menu-arrow {
    margin-left: var(--space-2);
    width: 16px;
    height: 16px;
  }

  .site-header__menu-divider {
    margin-top: var(--space-4);
    margin-bottom: var(--space-2);
    border: none;
    border-top: 1px solid var(--color-slate-200);
  }

  .site-header__menu-nav-item {
    position: relative;
    display: flex;
    align-items: center;
  }

  .site-header__menu-nav-link {
    display: flex;
    align-items: center;
    width: 100%;
    padding: var(--space-2) 0;
    color: var(--color-slate);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .site-header__menu-nav-link:hover {
    text-decoration: underline;
    color: var(--color-purple);
  }

  /* Search Form */
  .site-header__search-form {
    margin-top: var(--space-2);
  }

  .site-header__search-wrapper {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--color-slate-100);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
  }

  .site-header__search-input {
    background: transparent;
    flex: 1;
    font-size: var(--text-sm);
    border: none;
    outline: none;
  }

  .site-header__search-input:focus {
    outline: none;
  }

  .site-header__search-btn {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    color: var(--color-orange);
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .site-header__search-icon {
    width: 16px;
    height: 16px;
  }

  /* Mobile Menu Actions */
  .site-header__menu-primary-btn {
    font-size: var(--text-base);
    padding: var(--space-2) var(--space-4);
    margin-top: var(--space-4);
    width: 100%;
    cursor: pointer;
  }

  .site-header__menu-donate-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: var(--space-3) 0;
    margin-top: var(--space-2);
    text-transform: uppercase;
    font-family: var(--font-subheader);
    color: var(--color-slate);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .site-header__menu-donate-link:hover {
    text-decoration: underline;
    color: var(--color-purple);
  }
</style>
