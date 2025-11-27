<script>
  import { getContext } from "svelte";
  import Hero from "$lib/components/hero.svelte";
  import Ticker from "$lib/components/ticker.svelte";
  import CampaignCard from "$lib/components/campaign-card.svelte";
  import SecondaryAskCard from "$lib/components/secondary-ask-card.svelte";
  import ImpactSection from "$lib/components/impact-section.svelte";
  import MemberSection from "$lib/components/member-section.svelte";
  import ValuesSection from "$lib/components/values-section.svelte";
  import MobileCarousel from "$lib/components/mobile-carousel.svelte";
  import { homeContent } from "$lib/data/content";

  const modals = getContext("modals");
  const featuredCampaigns = homeContent.takeActionNow.featured || [];
  const primaryFeaturedCampaign = featuredCampaigns[0];
  const additionalFeaturedCampaigns = featuredCampaigns.slice(1);
  const mobileCarouselItems = [
    ...featuredCampaigns.map((campaign) => ({
      type: "campaign",
      data: campaign,
    })),
    { type: "secondary", data: homeContent.secondaryAsk },
    ...homeContent.takeActionNow.other.map((campaign) => ({
      type: "campaign",
      data: campaign,
    })),
  ];

  function scrollSnapAction(node) {
    if (window.innerWidth >= 768) return; // Only for mobile

    let hasSnapped = false;

    const handleScroll = () => {
      if (hasSnapped) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if element is near center of viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const distance = Math.abs(elementCenter - viewportCenter);

      if (distance < 100) {
        // Threshold for snapping
        node.scrollIntoView({ behavior: "smooth", block: "center" });
        hasSnapped = true;
        // Remove listener after snapping once
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return {
      destroy() {
        window.removeEventListener("scroll", handleScroll);
      },
    };
  }
</script>

<svelte:head>
  <title>{homeContent?.header?.title ?? "GetUp"}</title>
  <meta
    name="description"
    content={homeContent?.header?.description ?? "Join over a million GetUp members fighting for a fair, flourishing, and just Australia."}
  />
</svelte:head>

<main>
  <!-- Hero Section -->
  <Hero
    hero={homeContent.header}
    onOpenSignup={modals.openSignup}
    onOpenDonation={modals.openDonation}
  />

  <!-- Take Action Now Section -->
  <section
    class="relative overflow-hidden bg-white snap-center"
    use:scrollSnapAction
  >
    <div class="relative max-w-7xl mx-auto px-4 pt-8 pb-8 md:py-8 lg:py-12">
      <div class="flex justify-between md:max-h-auto items-center mb-4">
        <h2 class="text-4xl font-subheader text-slate-900">
          {@html homeContent.takeActionNow.heading.replace(
            /(\w+)\s*$/,
            '<span class="u-underlined">$1</span>',
          )}
        </h2>
        <a
          href="/campaigns"
          class="hidden sm:flex items-center justify-end text-sm text-slate-900 font-medium uppercase hover:underline ml-auto"
        >
          More campaigns
          <svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </div>

      <!-- Featured Campaigns -->
      <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#if primaryFeaturedCampaign}
          <CampaignCard
            campaign={primaryFeaturedCampaign}
            className="h-full"
            isFeatured={true}
          />
        {/if}

        {#each additionalFeaturedCampaigns as campaign}
          <CampaignCard
            {campaign}
            className="h-full hidden md:block"
            isFeatured={true}
          />
        {/each}

        <!-- Secondary Ask Card -->
        <div class="md:col-span-2 lg:col-span-1 hidden md:block">
          <SecondaryAskCard data={homeContent.secondaryAsk} />
        </div>
      </div>

      <!-- Other Campaigns -->
      <!-- Mobile: Carousel -->
      <div class="md:hidden mt-8">
        <MobileCarousel items={mobileCarouselItems} autoPlayInterval={3500}>
          {#snippet children(item)}
            {#if item.type === "secondary"}
              <SecondaryAskCard
                data={item.data}
                variant="dark"
                isMobile={true}
              />
            {:else}
              <CampaignCard
                campaign={item.data}
                truncate={false}
                showActionButton={false}
                isMobile={true}
              />
            {/if}
          {/snippet}
        </MobileCarousel>
      </div>

      <!-- Desktop: Grid -->
      <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
        {#each homeContent.takeActionNow.other as campaign}
          <CampaignCard {campaign} truncate={true} isOther={true} />
        {/each}
      </div>
    </div>
  </section>

  <!-- Impact Section -->
  <ImpactSection data={homeContent.whatIsGetUp} />

  <!-- Member Section -->
  <MemberSection data={homeContent.mission} />

  <!-- Values Section -->
  <ValuesSection data={homeContent.values} />

  <!-- Footer Image -->
  {#if homeContent.footer?.image}
    <img
      class="w-full object-cover"
      style="max-height: 72vh;"
      src={homeContent.footer.image}
      alt="GetUp community in action"
    />
  {/if}
</main>
