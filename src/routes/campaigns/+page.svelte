<script lang="ts">
  import CampaignsAccordion from "$lib/components/campaigns-accordion.svelte";
  import CampaignCard from "$lib/components/campaign-card.svelte";
  import SidebarSubmenu from "$lib/components/sidebar-submenu.svelte";
  import { campaigns as rootCampaigns, pillars } from "$lib/data/content";

  const campaignList = rootCampaigns.filter((campaign) => !campaign.archived);

  const pillarMeta: Record<string, (typeof pillars)[number]> = pillars
    .filter((pillar) => pillar.slug !== "all")
    .reduce((acc, pillar) => {
      acc[pillar.slug] = pillar;
      return acc;
    }, {} as Record<string, (typeof pillars)[number]>);

  const pillarBuckets = campaignList.reduce<Record<string, typeof campaignList>>((acc, campaign) => {
    const key = campaign.pillar || "all";
    if (!acc[key]) acc[key] = [];
    acc[key].push(campaign);
    return acc;
  }, {});

  const accordionPillars = Object.entries(pillarBuckets).map(([key, campaigns]) => {
    const meta = pillarMeta[key];
    return {
      slug: meta?.slug || (key === "all" ? "core" : key.toLowerCase().replace(/\s+/g, "-")),
      heading: meta?.heading || (key === "all" ? "Core campaigns" : key.replace(/-/g, " ")),
      subhead: meta?.subhead || (key === "all" ? "Browse every live campaign in one place." : ""),
      blurb: meta?.blurb,
      colour: meta?.colour || "var(--color-orange)",
      image: meta?.image,
      campaigns,
    };
  });

  const featuredCampaigns = campaignList
    .filter((c) => c.featured)
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    .slice(0, 4);
</script>

<svelte:head>
  <title>Campaigns - GetUp</title>
  <meta
    name="description"
    content="Join our campaigns fighting for climate action, economic fairness, human rights, and democracy."
  />
</svelte:head>

<main class="bg-white">
  <section
    id="campaigns-header"
    class="relative overflow-hidden bg-(--color-orange)"
  >
    <div class="absolute inset-0 opacity-30">
      <div
        class="w-full h-full bg-gradient-to-r from-orange-900/60 via-orange-800/50 to-orange-700/60"
      ></div>
    </div>
    <div
      class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 relative text-white"
    >
      <div class="flex justify-between items-start">
        <div>
          <p class="uppercase text-xs font-semibold tracking-[0.3em] mb-2">
            Campaigns
          </p>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4"
          >
            All campaigns
          </h1>
          <p class="text-lg md:text-xl max-w-3xl">
            Our movement's agenda set by our members push for tangible, positive
            change. Call on decision-makers to deliver action on the issues we
            care about.
          </p>
        </div>
        <!-- Mobile Dropdown Instance -->
        <div class="lg:hidden">
          <SidebarSubmenu
            items={accordionPillars.map((p) => ({
              label: p.heading,
              href: `#${p.slug}`,
            }))}
            mobileLayout="header"
            headerSelector="#campaigns-header"
          />
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
    <div class="lg:flex lg:gap-12">
      <div class="hidden lg:block">
        <SidebarSubmenu
          items={accordionPillars.map((p) => ({
            label: p.heading,
            href: `#${p.slug}`,
          }))}
          mobileLayout="header"
          headerSelector="#campaigns-header"
        />
      </div>

      <div class="flex-1 min-w-0 space-y-0">
        {#if featuredCampaigns.length}
          <div class="space-y-4 mb-6">
            <h2 class="text-xl font-bold text-slate-900">Featured campaigns</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {#each featuredCampaigns as campaign}
                <a
                  href={campaign.href}
                  class="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  {#if campaign.image}
                    <div class="aspect-[4/3] bg-gray-100 max-h-56 overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  {/if}
                  <div class="p-4">
                    <h3 class="text-lg font-semibold text-slate-900 line-clamp-2">
                      {campaign.title}
                    </h3>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <CampaignsAccordion pillars={accordionPillars} />
      </div>
    </div>
  </section>
</main>
