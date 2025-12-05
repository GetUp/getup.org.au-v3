<script>
  import { slide } from 'svelte/transition';
  import { campaigns as campaignData, pillars as pillarData } from '$lib/data/content';
  import LogoMarkExclaim from './logo-mark-exclaim.svelte';
  
  let { pillars = pillarData.filter((pillar) => pillar.slug !== 'all') } = $props();
  let openSlug = $state('');

  const campaignList = campaignData.filter((campaign) => !campaign.archived);
  const campaignsBySlug = $derived(
    campaignList.reduce((acc, campaign) => {
      const key = campaign.pillar || 'core';
      if (!acc[key]) acc[key] = [];
      acc[key].push(campaign);
      return acc;
    }, /** @type {Record<string, typeof campaignList>} */ ({}))
  );
  
  /** @param {string} slug */
  const toggle = (slug) => {
    openSlug = openSlug === slug ? '' : slug;
    if (typeof window !== 'undefined') {
      history.replaceState(history.state, '', `#${slug}`);
    }
  };
</script>

<section class="bg-sand scroll-snap-section">
  <div class="bg-white" transition:slide={{ duration: 300 }}>
    {#each pillars as pillar}
      <div class="border-b border-gray-100" id={pillar.slug}>
        <button 
          class="flex items-center gap-4 px-4 py-4 w-full hover:bg-sand transition-colors"
          onclick={() => toggle(pillar.slug)}
          aria-expanded={openSlug === pillar.slug}
        >
          <div class="w-16 h-16 rounded-md overflow-hidden border border-gray-200 shrink-0 bg-slate-900 flex items-center justify-center">
            {#if pillar.image}
              <img src={pillar.image} alt={pillar.heading} class="w-full h-full object-cover" loading="lazy" />
            {:else}
              <LogoMarkExclaim class="w-7 h-7 text-white" />
            {/if}
          </div>
          <div class="flex-1 text-left">
            <p class="text-xs uppercase tracking-wide text-gray-500">Pillar</p>
            <h3 class="font-subheader text-slate text-lg md:text-xl">{pillar.heading}</h3>
            {#if pillar.subhead}
              <p class="text-sm text-gray-700 mt-0.5 font-sans">{pillar.subhead}</p>
            {/if}
            {#if pillar.examples}
              <p class="text-sm text-gray-600 mt-0.5 font-sans italic">{pillar.examples}</p>
            {/if}
          </div>
          <svg class="w-5 h-5 text-gray-400 transition-transform {openSlug === pillar.slug ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {#if openSlug === pillar.slug}
          <div class="px-6 pb-5 space-y-3" transition:slide={{ duration: 200 }}>
            {#if pillar.blurb}
              <p class="text-sm text-gray-700 font-sans">{pillar.blurb}</p>
            {/if}
            <div class="space-y-2 pl-2 border-l-2 border-gray-100">
              {#each campaignsBySlug[pillar.slug] || [] as campaign}
                <a
                  class="flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-orange hover:bg-sand transition-colors items-center"
                  href={campaign.href}
                >
                  {#if campaign.image}
                    <div class="w-16 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <img src={campaign.image} alt={campaign.title} class="w-full h-full object-cover" loading="lazy" />
                    </div>
                  {/if}
                  <div class="flex-1">
                    <p class="font-subheader text-slate">{campaign.title}</p>
                    <p class="text-sm text-gray-600 font-sans line-clamp-2">{campaign.excerpt}</p>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>
