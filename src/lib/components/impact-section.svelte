<script>
  import { onMount } from "svelte";

  let { data } = $props();

  const heading = data.heading || 'GetUp is a powerful campaigning community.';
  const body = data.body || [];
  const images = data.images || [];
  const impactStats = data.impactStats || { heading: '', stats: [] };

  let stats = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch('https://www.getup.org.au/api/transparency_stats');
      const json = await res.json();
      stats = json;
      loading = false;
    } catch (e) {
      console.error('Failed to fetch stats', e);
      loading = false;
    }
  });

  // Helper to format currency
  const currency = (val) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  // Helper to format numbers
  const number = (val) => new Intl.NumberFormat('en-AU').format(val);

  // Map API data to display stats
  const displayStats = $derived(
    impactStats.stats.map(stat => {
      let dynamicValue = stat.value;
      if (stat.label === 'Average Donations') {
        const avg = stats.find(s => s.name === 'Average Donations');
        if (avg) dynamicValue = currency(avg.month);
      }
      if (stat.label === 'Small Donors') {
        const total = stats.find(s => s.name === 'Donations Total');
        if (total) dynamicValue = number(total.month);
      }

      return {
        ...stat,
        value: loading ? '...' : dynamicValue
      };
    })
  );
</script>

<section class="py-8 md:py-12 bg-white md:bg-sand-50 relative overflow-hidden">
  <div class="container mx-auto px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Heading Row -->
      <h2 class="text-4xl font-bold text-slate-900 mb-8">
        {heading}
      </h2>

      <!-- Content Grid -->
      <div class="flex flex-col md:flex-row justify-items">
        <!-- Left Column on Desktop: Stats Card (appears first on mobile) -->
        <div class="lg:flex-1">
          <div class="relative w-full max-w-md mb-8 md:mb-0">
            <div class="relative bg-(--color-orange) p-6 md:p-8 rounded-sm shadow-2xl border border-orange-600">
              <!-- Header Labels -->
              <div class="flex justify-between items-center mb-6 border-b-2 border-white/30 pb-2 relative">
                <div class="flex justify-between w-full text-xs font-bold text-white tracking-widest uppercase">
                  <span>People</span>
                  <span>Power</span>
                  <span class="u-underlined u-underlined--white">Impact</span>
                </div>
              </div>

              <h3 class="font-subheader text-3xl md:text-4xl text-white mb-6 leading-tight tracking-tight uppercase">
                {impactStats.heading}
              </h3>

              <div class="bg-white p-6 relative rounded-sm">
                <!-- Vertical Text -->
                <div class="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center border-l border-gray-200">
                  <span class="transform rotate-90 whitespace-nowrap text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Updated: 20 February 2025
                  </span>
                </div>

                <div class="space-y-6 pr-8">
                  {#each displayStats as stat}
                    <div class="flex flex-col items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <span class="font-bold text-(--color-orange) text-lg leading-tight tracking-wide text-center mb-1">
                        {stat.label}
                      </span>
                      <span class="font-header text-6xl text-slate-900 text-center leading-none">{stat.value}</span>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column on Desktop: Text Content (appears second on mobile) -->
        <div class="lg:flex-1 flex flex-col justify-center">
          <div class="font-sans text-lg md:text-xl text-gray-800 leading-relaxed space-y-6 mb-8">
            {#each body as text}
              <p>{text}</p>
            {/each}
          </div>
          <a href="/about" class="btn btn-text text-(--color-purple) u-arrow">
            Read More
          </a>
        </div>
      </div>
    </div>

  </div>
</section>
