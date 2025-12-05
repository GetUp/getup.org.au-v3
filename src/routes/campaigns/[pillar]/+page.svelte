<script lang="ts">
  import { page } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import CampaignCard from "$lib/components/campaign-card.svelte";
  import SidebarSubmenu from "$lib/components/sidebar-submenu.svelte";
  import { campaigns as allCampaigns, pillars } from "$lib/data/content";
  import campaignsSettings from "../../../../content/settings/campaigns.json";

  const featuredPillar = {
    slug: "featured",
    heading: "Featured",
    subhead: "Popular campaigns happening now",
    image: undefined,
  };
  const corePillar = {
    slug: "core",
    heading: "Core",
    subhead: "Causes that are core to GetUp's values and priorities.",
    image: undefined,
  };
  const pillarSlug = $derived($page.params.pillar);
  const pillar = $derived(
    pillarSlug === "core"
      ? corePillar
      : pillarSlug === "featured"
        ? featuredPillar
        : pillars.find((p) => p.slug === pillarSlug)
  );

  let cbmPetitions = $state([]);

  const navItems = pillars
    .filter((p) => p.slug !== "all")
    .map((p) => ({
      label: p.heading,
      href: `/campaigns/${p.slug}`,
      icon: p.slug,
      iconFile: p.iconFile,
    }));
  const navLinks = [
    {
      label: "Campaigns",
      href: "/campaigns",
      icon: "star",
      children: [
        {
          label: featuredPillar.heading,
          href: `/campaigns/featured`,
          icon: "star",
        },
        { label: corePillar.heading, href: `/campaigns/core`, icon: "core" },
        ...navItems,
      ],
    },
  ];
  const activeHref = $derived(`${$page.url.pathname}${$page.url.hash}`);
  let searchTerm = $state("");

  $effect(() => {
    searchTerm = $page.url.searchParams.get("q") || "";
  });

  const pillarCampaigns = $derived(
    pillarSlug === "featured"
      ? allCampaigns.filter(
          (campaign) =>
            !campaign.archived &&
            (campaign.status === "featured" ||
              campaign.status === "top" ||
              campaign.featured)
        )
      : pillarSlug === "community-run"
        ? cbmPetitions
        : allCampaigns
            .filter((campaign) => !campaign.archived)
            .filter((campaign) => (campaign.pillar || "core") === pillarSlug)
  );

  const normalized = (value: string | undefined) => (value || "").toLowerCase();
  const filteredCampaigns = $derived(
    searchTerm.trim()
      ? pillarCampaigns.filter((c) => {
          const q = normalized(searchTerm);
          return (
            normalized(c.title).includes(q) ||
            normalized(c.excerpt).includes(q) ||
            normalized(c.slug).includes(q)
          );
        })
      : pillarCampaigns
  );
  const featuredCampaigns = $derived(
    [...pillarCampaigns]
      .filter(
        (c) => c.status === "featured" || c.status === "top" || c.featured
      )
      .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
  );

  const handleSearchEvent = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    searchTerm = typeof detail === "string" ? detail : "";
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("campaign-search", handleSearchEvent);

    // Fetch CBM petitions if viewing community-run pillar
    if (pillarSlug === "community-run") {
      const cbmCount = campaignsSettings.cbmCount || 10;
      const script = document.createElement("script");
      const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());

      // Define global callback
      (window as any)[callbackName] = (data: any) => {
        delete (window as any)[callbackName];
        document.body.removeChild(script);

        const list = Array.isArray(data) ? data : data.data || data.results || [];
        cbmPetitions = list.slice(0, cbmCount).map((p: any) => ({
          title: p.title,
          excerpt: p.blurb || p.description || p.summary || p.overview || p.what || p.content || p.body || p.text || "Community-driven petition to create change.",
          description: p.blurb || p.description || p.summary || p.overview || p.what || p.content || p.body || p.text || "Community-driven petition to create change.",
          image: p.image_url?.replace("http://", "https://") || null,
          href: p.url,
          link: p.url,
          pillar: "community-run",
          slug: `cbm-${p.slug || p.id}`,
          isCbm: true,
          status: "none",
        }));
      };

      script.src = `https://petitions.getup.org.au/petitions/featured.json?callback=${callbackName}`;
      document.body.appendChild(script);
    }
  });

  onDestroy(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("campaign-search", handleSearchEvent);
  });
</script>

<svelte:head>
  <title>{pillar?.heading || "Campaigns"} - GetUp</title>
  <meta
    name="description"
    content={`Campaigns for pillar ${pillar?.heading || pillarSlug || "Campaigns"}`}
  />
</svelte:head>

<section
  id="pillar-header"
  class="relative overflow-hidden bg-(--color-orange)"
>
  <div class="absolute inset-0 opacity-30">
    {#if pillar?.image}
      <div
        class="w-full h-full bg-cover bg-center"
        style={`background-image: url(${pillar.image});`}
      ></div>
    {/if}
    <div
      class="w-full h-full bg-gradient-to-r from-orange-900/70 via-orange-800/60 to-orange-700/70"
    ></div>
  </div>
  <div
    class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 relative text-white"
  >
    <div class="flex flex-col gap-3">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-black leading-wide">
        {pillar?.heading || pillarSlug}
      </h1>
      {#if pillar?.subhead}
        <p class="text-lg md:text-xl max-w-3xl">
          {pillar.subhead}
        </p>
      {/if}
    </div>
  </div>
</section>

<main class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
  <div class="lg:flex lg:gap-12">
    <div class="hidden lg:block">
      <SidebarSubmenu
        items={navLinks}
        mobileLayout="header"
        headerSelector="#pillar-header"
        {activeHref}
      />
    </div>

    <div class="flex-1 min-w-0 space-y-6">
      {#if pillarSlug === "featured"}
        <div class="space-y-3" id="pillar-campaigns">
          <h2 class="text-lg font-weight-400 text-slate-900">
            {featuredPillar.heading}
          </h2>
          {#if featuredCampaigns.length === 0}
            <p class="text-gray-600">No campaigns found.</p>
          {:else}
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each featuredCampaigns as campaign (campaign.slug || campaign.href || campaign.title)}
                <CampaignCard {campaign} variant="compact" />
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <div class="space-y-3" id="pillar-campaigns">
          <h2 class="text-lg font-bold text-slate-900">
            {pillar?.heading || pillarSlug}
          </h2>
          {#if filteredCampaigns.length === 0}
            <p class="text-gray-600">No campaigns found for this pillar.</p>
          {:else}
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each filteredCampaigns as campaign (campaign.slug || campaign.href || campaign.title)}
                <CampaignCard {campaign} variant="compact" />
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</main>
