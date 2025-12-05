<script lang="ts">
  import CampaignCard from "$lib/components/campaign-card.svelte";
  import SecondaryAskCard from "$lib/components/secondary-ask-card.svelte";
  import MobileCarousel from "$lib/components/mobile-carousel.svelte";
  import { underlineLastWord } from "$lib/utils/heading";

  let { heading, top = [], featured = [], secondaryAsk } = $props();

  const primaryTopCampaign = top[0];
  const additionalTopCampaigns = top.slice(1);

  // Helper to generate a stable unique key for each campaign
  const getCampaignKey = (campaign: any, prefix: string) => {
    // Use href/link/url as primary key (should be unique), fallback to title
    const uniqueId = campaign?.href || campaign?.link || campaign?.path || campaign?.title || '';
    return `${prefix}-${uniqueId}`;
  };

  // Truncate featured campaigns to only show complete rows
  // lg screens: 4 columns, md screens: 2 columns
  // By ensuring divisibility by 4, we also ensure divisibility by 2
  const displayedFeatured = $derived(
    featured.slice(0, Math.floor(featured.length / 4) * 4)
  );

  // Build carousel items with truly unique keys (based on URLs, not indices)
  const mobileCarouselItems = $derived([
    ...top.map((campaign) => ({
      key: getCampaignKey(campaign, 'top'),
      type: "campaign" as const,
      data: campaign,
    })),
    { key: "secondary-ask", type: "secondary" as const, data: secondaryAsk },
    ...featured.map((campaign) => ({
      key: getCampaignKey(campaign, 'featured'),
      type: "campaign" as const,
      data: campaign,
    })),
  ]);
</script>

<!-- Take Action Now Section -->
<section id="take-action" class="relative overflow-hidden bg-transparent">
  <div class="relative max-w-7xl mx-auto px-4 py-8 md:py-8 lg:py-12">
    <!-- Section Header -->
    <div class="flex justify-between items-center mb-4 md:mb-6">
      <h2 class="font-header text-4xl md:text-5xl lg:text-6xl text-slate-light">
        {@html underlineLastWord(heading)}
      </h2>
      <a
        href="/campaigns"
        class="hidden sm:flex items-center text-sm text-slate-900 font-medium uppercase hover:underline gap-1"
      >
        More campaigns
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>

    <!-- Desktop: Top Campaigns Grid -->
    <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#if primaryTopCampaign}
        <CampaignCard campaign={primaryTopCampaign} variant="featured" />
      {/if}

      {#each additionalTopCampaigns as campaign (getCampaignKey(campaign, 'top'))}
        <CampaignCard {campaign} variant="featured" />
      {/each}

      <!-- Secondary Ask Card -->
      <div class="md:col-span-2 lg:col-span-1">
        <SecondaryAskCard data={secondaryAsk} />
      </div>
    </div>

    <!-- Mobile: Carousel -->
    <div class="md:hidden">
      <MobileCarousel items={mobileCarouselItems} autoPlayInterval={3500}>
        {#snippet children(item: any)}
          {#if item.type === "secondary"}
            <SecondaryAskCard data={item.data} isMobile={true} />
          {:else}
            <CampaignCard campaign={item.data} variant="featured" />
          {/if}
        {/snippet}
      </MobileCarousel>
    </div>

    <!-- Desktop: Featured/Other Campaigns -->
    <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {#each displayedFeatured as campaign (getCampaignKey(campaign, 'compact'))}
        <CampaignCard {campaign} variant="compact" />
      {/each}
    </div>
  </div>
</section>
