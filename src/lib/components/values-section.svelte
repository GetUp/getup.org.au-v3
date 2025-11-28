<script>
  import ValuesCarousel from './values-carousel.svelte';

  let { data } = $props();

  const heading = data.heading || 'Our values';
  const items = data.items || [];
</script>

<!-- Mobile: Carousel with shimmer effect -->
<div class="md:hidden">
  <section class="relative overflow-hidden bg-white">
    <div class="max-w-7xl mx-auto px-4 pt-6 md:pt-8 pb-4">
      <h2 class="text-4xl font-bold text-slate-900">{heading}</h2>
    </div>
  </section>
  <ValuesCarousel {items} />
</div>

<!-- Desktop: Original layout -->
<div class="hidden md:block">
  <section class="relative overflow-hidden bg-white">
    <div class="max-w-7xl mx-auto px-4 pt-6 md:pt-8 pb-4">
      <h2 class="text-4xl font-bold text-slate-900">{heading}</h2>
    </div>
  </section>

  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-slate-900 w-1/12 hidden xl:block"></div>
    <div class="relative bg-linear-to-l from-slate-900 to-slate-600">
      <div class="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-24">
        <div class="flex mx-auto">
          <div class="w-full lg:grid xl:grid-cols-12 lg:grid-flow-row-dense">

          {#each items as item, i}
            <img
              class="h-96 w-full object-cover {i % 2 === 0 ? 'col-span-7 col-start-1' : 'col-span-7 col-start-6'}"
              src={item.image}
              alt={item.heading}
              data-aos="fade-up"
            />
            <div
              class="{i % 2 !== 0 ? 'col-start-1' : ''} col-span-5 pt-4 pb-8 md:px-8 flex flex-col justify-end md:justify-center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <p class="text-4xl font-bold tracking-tight text-white mb-4">{item.heading}</p>
              <p class="text-xl text-white">{item.body}</p>
            </div>
          {/each}
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
