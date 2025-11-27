<script>
  import { reportsContent } from "$lib/data/content";

  let { content = reportsContent } = $props();
</script>

<section id="transparency" class="py-16 px-4 bg-white scroll-snap-section">
  <div class="max-w-7xl mx-auto">
    <div class="grid gap-10">
      <div class="overflow-hidden rounded-lg shadow">
        <img src={content.header.image} alt={content.header.heading} class="w-full h-72 object-cover" />
      </div>
      
      <div class="space-y-4 max-w-4xl">
        <h2 class="font-subheader text-3xl sm:text-4xl text-slate tracking-tight">{content.header.subhead}</h2>
      </div>
      
      <div class="grid lg:grid-cols-2 gap-8">
        {#each content.reports as report}
          <a 
            href={report.link}
            class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-sand rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="md:col-span-1 h-48 md:h-full">
              <img src={report.image} alt={report.heading} class="w-full h-full object-cover" />
            </div>
            <div class="md:col-span-2 p-4 md:p-6 space-y-2 flex flex-col justify-center">
              <h3 class="text-xl md:text-2xl font-bold text-slate leading-tight">{report.heading}</h3>
              <p class="text-gray-700">{report.description}</p>
              <span class="text-orange font-semibold text-sm">Open report →</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </div>
</section>
