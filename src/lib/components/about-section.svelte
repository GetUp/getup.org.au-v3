<script>
  import { aboutContent } from '$lib/data/content';
  
  let { data = aboutContent } = $props();
</script>

<section id="about" class="py-16 px-4 bg-sand scroll-snap-section">
  <div class="max-w-7xl mx-auto">
    <div class="max-w-4xl mb-16 space-y-4">
      <p class="font-subheader text-4xl sm:text-5xl text-slate tracking-tight leading-tight">
        {data.header.heading}
      </p>
      <p class="text-lg text-slate leading-relaxed max-w-3xl">
        {data.header.subhead}
      </p>
    </div>
    
    <div class="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center mb-16">
      <div class="space-y-3">
        <p class="text-sm uppercase font-semibold text-gray-500">{data.who.heading}</p>
        <h2 class="font-subheader text-3xl text-slate leading-tight">{data.who.subhead}</h2>
        {#each data.who.body as paragraph}
          <p class="text-lg text-slate leading-relaxed">{paragraph}</p>
        {/each}
      </div>
      <div class="rounded-lg overflow-hidden shadow-lg">
        <img src={data.who.image} alt={data.who.heading} class="w-full h-full object-cover" />
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6 md:p-10 mb-16">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p class="text-sm uppercase font-semibold text-gray-500">{data.what.heading}</p>
          <h3 class="font-subheader text-3xl text-slate leading-tight">{data.what.subhead}</h3>
        </div>
        {#if data.what.body?.length}
          <p class="text-slate md:max-w-xl">{data.what.body[0]}</p>
        {/if}
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each data.what.items as item}
          <div class="relative rounded-lg overflow-hidden shadow">
            <img src={item.image} alt={item.alt || item.text} class="w-full h-48 object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <p class="absolute bottom-3 left-3 right-3 text-white font-semibold leading-tight">{item.text}</p>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start mb-16">
      <div class="space-y-3">
        <p class="text-sm uppercase font-semibold text-gray-500">{data.how.heading}</p>
        <h3 class="font-subheader text-3xl text-slate leading-tight">{data.how.subhead}</h3>
        {#each data.how.body as paragraph}
          <p class="text-slate leading-relaxed">{paragraph}</p>
        {/each}
      </div>
      <div class="rounded-lg overflow-hidden shadow-lg">
        <img src={data.how.strategySmallImage} alt="" class="w-full h-full object-cover" />
      </div>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8 mb-16">
      {#each data.how.strategies as strategy}
        <div class="bg-white rounded-lg shadow p-6 space-y-2 border border-gray-100">
          <p class="text-sm uppercase font-semibold text-orange">Strategy</p>
          <h4 class="text-xl font-bold text-slate">{strategy.heading}</h4>
          <p class="text-gray-700 leading-relaxed">{strategy.body}</p>
        </div>
      {/each}
    </div>
    
    <div class="rounded-lg overflow-hidden shadow-lg mb-16">
      <img src={data.how.strategyImage} alt="" class="w-full h-full object-cover" />
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6 md:p-10">
      <p class="text-sm uppercase font-semibold text-gray-500">{data.donations.heading}</p>
      <h3 class="font-subheader text-3xl text-slate leading-tight">{data.donations.subhead}</h3>
      <div class="space-y-3 mt-4">
        {#each data.donations.body as paragraph}
          <p class="text-slate leading-relaxed">{paragraph}</p>
        {/each}
      </div>
    </div>
  </div>
</section>
