<script lang="ts">
  import { aboutContent } from "$lib/data/content";
  const who = aboutContent.who;
  const what = aboutContent.what;
  const how = aboutContent.how;
  const donations = aboutContent.donations;
</script>

<svelte:head>
  <title>About Us - GetUp</title>
  <meta
    name="description"
    content="GetUp is an independent movement of more than one million people building a fair, flourishing, and just Australia."
  />
</svelte:head>

<section class="space-y-16">
  <!-- Who we are -->
  <div class="space-y-8">
    <div class="space-y-4">
      <h1 class="text-3xl md:text-4xl font-subheader leading-tight">About GetUp</h1>
      <h2 class="text-3xl md:text-4xl font-subheader leading-tight">{who.subhead}</h2>
      {#if who.body?.length}
        <p class="text-lg text-gray-800 leading-relaxed">{who.body[0]}</p>
        {#if who.body[1]}
          <p class="text-gray-700 leading-relaxed">{who.body[1]}</p>
        {/if}
      {/if}
      <div class="space-y-2 text-sm text-gray-700">
        <div class="flex items-start gap-2"><span class="text-(--color-orange)">◆</span> People-powered</div>
        <div class="flex items-start gap-2"><span class="text-(--color-orange)">◆</span> Fiercely independent</div>
        <div class="flex items-start gap-2"><span class="text-(--color-orange)">◆</span> Values-driven</div>
        <div class="flex items-start gap-2"><span class="text-(--color-orange)">◆</span> Impact-focused</div>
      </div>
    </div>
    <div class="rounded-xl overflow-hidden shadow-lg">
      <img src={who.image} alt="GetUp members" class="w-full h-full object-cover" />
    </div>
  </div>

  <!-- What we work on -->
  <div class="space-y-6">
    <div class="space-y-2">
      <h3 class="text-3xl font-subheader leading-tight">{what.subhead}</h3>
      <p class="text-gray-700 max-w-3xl">{what.body?.[0]}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-4">
      {#each what.items as item}
        <div class="relative rounded-lg overflow-hidden shadow-md group">
          <img src={item.image} alt={item.alt || item.text} class="w-full h-48 object-cover transition duration-300 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <p class="absolute bottom-3 left-3 right-3 text-white font-semibold leading-tight">
            {item.text}
          </p>
        </div>
      {/each}
    </div>
  </div>

  <!-- How we do it -->
  <div class="grid lg:grid-cols-2 gap-10 items-start">
    <div class="space-y-3">
      <h3 class="text-3xl font-subheader leading-tight">{how.subhead}</h3>
      <p class="text-gray-700 leading-relaxed">{how.body?.[0]}</p>
      <div class="grid sm:grid-cols-2 gap-4">
        {#each how.strategies as strategy}
          <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <p class="text-xs uppercase font-semibold text-(--color-orange) mb-1">Strategy</p>
            <p class="font-bold text-lg text-slate-900">{strategy.heading}</p>
            <p class="text-gray-700 text-sm mt-1">{strategy.body}</p>
          </div>
        {/each}
      </div>
    </div>
    <div class="space-y-4">
      <div class="rounded-xl overflow-hidden shadow-lg">
        <img src={how.strategySmallImage} alt="" class="w-full h-full object-cover" />
      </div>
      <div class="rounded-xl overflow-hidden shadow-lg">
        <img src={how.strategyImage} alt="" class="w-full h-full object-cover" />
      </div>
    </div>
  </div>

  <!-- Supporting GetUp -->
  <div class="card space-y-4">
    <div class="space-y-2">
      <h3 class="text-3xl font-subheader leading-tight">{donations.subhead}</h3>
    </div>
    <div class="space-y-3 text-gray-700 leading-relaxed">
      {#each donations.body as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>
    <div class="flex flex-wrap gap-3">
      <a class="btn btn-primary u-arrow" href="/donate">Donate</a>
      <a class="btn btn-ghost" href="/campaigns">Join the movement</a>
    </div>
  </div>
</section>
