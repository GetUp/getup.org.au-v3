<script>
  import TijuanaEmbed from "$lib/components/tijuana-embed.svelte";
  import { donateContent } from "$lib/data/content";

  const header = donateContent.header || {};
  const heroImage = "/images/media-header.jpg";
</script>

<svelte:head>
  <title>Donate to GetUp!</title>
  <meta
    name="description"
    content="Donate to fuel people-powered campaigns for a fair, flourishing, and just Australia."
  />
</svelte:head>

<main class="bg-white">
  <!-- Header + embed split -->
  <section class="bg-white">
    <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
      <div class="grid lg:grid-cols-2 gap-10 items-start">
        <div class="space-y-6">
          <h1 class="font-display font-bold text-(--color-orange) text-4xl md:text-5xl leading-tight">
            {header.heading}
          </h1>
          <p class="text-xl md:text-2xl text-(--color-orange) leading-tight">
            {header.subhead}
          </p>
          {#if header.highlights?.[0]}
            <p class="font-body text-lg md:text-xl text-(--color-slate)">
              {header.highlights[0]}
            </p>
          {/if}
          {#if header.body}
            <div class="space-y-4 text-lg leading-relaxed text-(--color-slate)">
              <p>{header.body}</p>
            </div>
          {/if}
          {#if header.ctas?.length}
            <div class="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-4">
              {#each header.ctas as cta, i}
                <a
                  class="relative overflow-hidden rounded-xl border border-(--color-sand) bg-(--color-sand) shadow-sm p-5 space-y-3"
                  href={cta.link}
                >
                  <h2 class="font-display text-xl md:text-2xl leading-snug text-(--color-slate)">{cta.heading}</h2>
                  <p class="text-(--color-slate) text-base md:text-lg leading-relaxed">{cta.copy}</p>
                  <span
                    class={`inline-flex items-center gap-2 font-semibold text-sm px-3 py-2 rounded-md ${
                      i === 0
                        ? "bg-(--color-purple) text-white"
                        : "bg-(--color-orange) text-white"
                    } border border-(--color-sand)`}
                  >
                    {cta.action}
                    <span aria-hidden="true">→</span>
                  </span>
                </a>
              {/each}
            </div>
          {/if}
        </div>
        <div class="w-full bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
          <div class="aspect-video">
            <TijuanaEmbed src={header.embed} />
          </div>
        </div>
      </div>
    </div>
  </section>

  {#if header.ctas?.length}
    <section class="bg-white py-12 md:py-16 lg:hidden">
      <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
        {#each header.ctas as cta, i}
          <a
            class="relative overflow-hidden rounded-2xl shadow-lg border border-(--color-sand) bg-(--color-sand) group"
            href={cta.link}
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
            ></div>
            <div class="relative p-8 text-(--color-slate-light) space-y-3">
              <h2 class="font-display text-xl leading-tight">{cta.heading}</h2>
              <p class="text-base opacity-95 leading-relaxed">{cta.copy}</p>
              <span
                class={`inline-flex items-center gap-2 font-semibold px-3 py-2 rounded-md ${
                  i === 0 ? "bg-(--color-purple) text-white" : "bg-(--color-orange) text-white"
                }`}
              >
                {cta.action}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}
</main>
