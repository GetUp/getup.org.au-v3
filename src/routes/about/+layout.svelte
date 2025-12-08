<script lang="ts">
  import { page } from "$app/stores";
  import SidebarSubmenu from "$lib/components/sidebar-submenu.svelte";
  import { aboutContent } from "$lib/data/content";

  let { children } = $props();

  // Check if we're on the root about page (for different layout treatment)
  const isRootPage = $derived($page.url.pathname === "/about");


  const navItems = [
    {
      label: "About",
      href: "/about",
      icon: "star",
      children: [
        { label: "Overview", href: "/about", exact: true },
        { label: "Board", href: "/about/board" },
        { label: "Work at GetUp", href: "/about/work-at-getup" },
        { label: "Reports", href: "/about/reports" },
        { label: "FAQs", href: "/about/faqs" },
        { label: "Transparency", href: "/about/transparency" },
        { label: "Donation snapshot", href: "/about/donations-snapshot" },
      ],
    },
  ];

  const heroTitle = $derived(aboutContent.header.heading || "About us");
  const heroSubhead = $derived(
    aboutContent.header.subhead ||
      "We're an independent movement of more than one million people working to build a progressive Australia and put people back into politics.",
  );
  const heroImage = $derived(
    aboutContent.header.image || "/images/human-rights.jpg",
  );
</script>

<main class="page-main">
  <section class="about-hero page-hero">
    <div class="page-hero__overlay">
      <div class="about-hero__image" style={`background-image:url(${heroImage});`}></div>
      <div class="about-hero__gradient"></div>
    </div>
    <div class="page-hero__content">
      <div class="about-hero__text">
      <h1 class="about-hero__title font-display">
          {heroTitle}
        </h1>
        <p class="about-hero__subhead">
          {heroSubhead}
        </p>
      </div>
    </div>
  </section>

  <section class="about-content" class:about-content--overview={isRootPage}>
    <div class="about-content__container">
      <div class="about-content__sidebar">
        <SidebarSubmenu
          items={navItems}
          mobileLayout="handle"
          headerSelector="section"
          activeHref={$page.url.pathname + $page.url.hash}
        />
      </div>
      <div class="about-content__main">
        {@render children()}
      </div>
    </div>
  </section>
</main>

<style>
  /* ==========================================================================
     About Layout Styles
     ========================================================================== */

  /* Hero Section */
  .about-hero {
    background: var(--color-orange);
  }

  .about-hero__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .about-hero__gradient {
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

  .about-hero__text {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    max-width: 56rem;
  }

  .about-hero__title {
    font-family: var(--font-display);
    font-size: clamp(var(--text-4xl), 6vw, var(--text-6xl));
    font-weight: var(--font-normal);
    line-height: var(--leading-tight);
    letter-spacing: -0.02em;
    color: var(--color-white);
  }

  .about-hero__subhead {
    font-size: clamp(var(--text-lg), 2vw, var(--text-xl));
    line-height: var(--leading-snug);
    max-width: 48rem;
    color: var(--color-white);
  }

  /* Content Section */
  .about-content {
    padding: var(--space-10) var(--space-4);
  }

  @media (min-width: 1024px) {
    .about-content {
      padding: var(--space-14) var(--space-4);
    }
  }

  .about-content__container {
    width: min(var(--container-xl), 100%);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  @media (min-width: 768px) {
    .about-content__container {
      padding-inline: var(--space-6);
    }
  }

  @media (min-width: 1024px) {
    .about-content__container {
      padding-inline: var(--space-8);
      grid-template-columns: 240px 1fr;
      gap: var(--space-12);
    }
  }

  .about-content__sidebar {
    display: contents;
  }

  @media (min-width: 1024px) {
    .about-content__sidebar {
      display: block;
      grid-column: 1;
      grid-row: 1;
    }
  }

  .about-content__main {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
  }

  @media (min-width: 1024px) {
    .about-content__main {
      grid-column: 2;
      grid-row: 1;
    }
  }

  /* Overview page: allow full-width breakout */
  .about-content--overview .about-content__main {
    display: contents;
  }

  .about-content--overview .about-content__main :global(> *) {
    grid-column: 1 / -1;
  }

  .about-content--overview .about-content__main :global(> :first-child) {
    grid-column: 1;
  }

  @media (min-width: 1024px) {
    .about-content--overview .about-content__container {
      grid-template-rows: auto 1fr;
    }

    .about-content--overview .about-content__main :global(> :first-child) {
      grid-column: 2;
      grid-row: 1;
    }

    .about-content--overview .about-content__main :global(> .about-page__full-width) {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }
</style>
