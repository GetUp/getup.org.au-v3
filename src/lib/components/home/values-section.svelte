<script>
  import ValuesCarousel from "./values-carousel.svelte";
  import { underlineLastWord } from "$lib/utils/heading";

  let { data } = $props();

  const heading = data.heading || "Our values";
  const items = data.items || [];
</script>

<!-- Mobile: Carousel with shimmer effect -->
<div class="md:hidden">
  <section class="relative overflow-hidden bg-transparent">
    <div class="max-w-7xl mx-auto px-4 pt-6 md:pt-8 pb-4">
      <h2 class="font-header text-4xl md:text-5xl lg:text-6xl text-slate-light mb-4 md:mb-8">
        {@html underlineLastWord(heading)}
      </h2>
    </div>
  </section>
  <ValuesCarousel {items} />
</div>

<!-- Desktop: Original layout -->
<div class="hidden md:block">
  <section class="relative overflow-hidden bg-transparent">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h2 class="font-header text-4xl md:text-5xl lg:text-6xl text-slate-light mb-4"> {@html underlineLastWord(heading)}</h2>
    </div>
  </section>

  <section class="relative overflow-hidden">
    <div class="absolute inset-0 w-1/12 hidden xl:block"></div>
    <div class="relative">
      <div class="max-w-7xl mx-auto p-2 md:py-4 lg:py-6">
        <div class="bg-slate-700 flex mx-auto">
          <div class="w-full lg:grid xl:grid-cols-12 lg:grid-flow-row-dense">
            {#each items as item, i}
              <img
                class="h-96 w-full object-cover {i % 2 === 0
                  ? 'col-span-7 col-start-1'
                  : 'col-span-7 col-start-6'}"
                src={item.image}
                alt={item.title || item.heading}
                loading="lazy"
              />
              <div
                class="{i % 2 !== 0
                  ? 'col-start-1'
                  : ''} col-span-5 pt-4 pb-8 md:px-8 flex flex-col justify-end md:justify-center"
              >
                <p class="text-4xl font-bold tracking-tight text-white mb-4">
                  {item.title || item.heading}
                </p>
                <p class="text-xl text-white">{item.body}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
