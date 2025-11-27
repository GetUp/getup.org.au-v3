<script>
  import TakeAction from "$lib/components/take-action.svelte";
  import CampaignsAccordion from "$lib/components/campaigns-accordion.svelte";
  import SidebarSubmenu from "$lib/components/sidebar-submenu.svelte";
  import { campaigns as rootCampaigns, pillars } from "$lib/data/content";

  const campaignList = rootCampaigns.filter((campaign) => !campaign.archived);

  const pillarMeta = pillars
    .filter((pillar) => pillar.slug !== "all")
    .reduce((acc, pillar) => {
      acc[pillar.heading] = pillar;
      return acc;
    }, {});

  const pillarBuckets = campaignList.reduce((acc, campaign) => {
    const key = campaign.pillar || "all";
    if (!acc[key]) acc[key] = [];
    acc[key].push(campaign);
    return acc;
  }, {});

  const accordionPillars = Object.entries(pillarBuckets).map(([key, campaigns]) => {
    const meta = pillarMeta[key];
    return {
      slug: meta?.slug || (key === "all" ? "all" : key.toLowerCase().replace(/\s+/g, "-")),
      heading: meta?.heading || "All campaigns",
      subhead: meta?.subhead || "Browse every live campaign in one place.",
      blurb: meta?.blurb,
      colour: meta?.colour || "var(--color-orange)",
      image: meta?.image,
      campaigns,
    };
  });

  const sidebarPillars = accordionPillars;
  const takeActionList = campaignList;
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
            items={sidebarPillars.map((p) => ({
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
          items={sidebarPillars.map((p) => ({
            label: p.heading,
            href: `#${p.slug}`,
          }))}
          mobileLayout="header"
          headerSelector="#campaigns-header"
        />
      </div>

      <div class="flex-1 min-w-0 space-y-10">
        <CampaignsAccordion pillars={accordionPillars} />

        <div class="pt-4">
          <TakeAction heading="Take action now" actions={takeActionList} />
        </div>
      </div>
    </div>
  </section>
</main>
