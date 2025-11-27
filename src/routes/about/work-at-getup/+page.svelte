<script lang="ts">
  import { onMount } from "svelte";
  import { parse } from "yaml";
  import Accordion from "$lib/components/accordion.svelte";
  import workContentRaw from "../../../../content/work-at-getup.yaml?raw";

  const data = parse(workContentRaw);
  const heading = data.heading ?? "Work at GetUp";
  const subheading = data.subheading ?? "";
  const intro = data.intro ?? "";
  const bullets: string[] = data.bullets ?? [];
  const ctaLabel = data.cta_label ?? "View current vacancies";
  const ctaHref = data.cta_href ?? "#vacancies";
  const heroImage = data.hero_image ?? "/images/uploads/work-at-getup.jpg";
  const benefits = data.benefits ?? [];
  const values = data.values ?? [];

  let isClient = $state(false);
  onMount(() => (isClient = true));
</script>

<svelte:head>
  <title>Work at GetUp</title>
  <meta
    name="description"
    content="Join the team powering a million-strong movement for a fair, flourishing, and just Australia."
  />
</svelte:head>

<section class="space-y-12">
  <div class="space-y-4">
    <h1>{heading}</h1>
    {#if subheading}<h3>{subheading}</h3>{/if}
    <div class="space-y-3">
      {#each intro.split(/\n+/) as paragraph}
        {#if paragraph.trim()}<p>{paragraph.trim()}</p>{/if}
      {/each}
      {#if bullets?.length}
        <ul>
          {#each bullets as item}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}
    </div>
    <div>
      <a href={ctaHref} class="btn btn-primary u-arrow">{ctaLabel}</a>
    </div>
  </div>

  <div class="rounded-xl overflow-hidden shadow-lg">
    <img src={heroImage} alt="Work at GetUp" class="w-full h-full object-cover" loading="lazy" />
  </div>

  <div class="grid md:grid-cols-2 gap-8">
    <div class="space-y-4">
      <h3>Employee Benefits</h3>
      <div class="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {#each benefits as benefit, i}
          <Accordion title={benefit.title} open={i === 0}>
            {#if benefit.description}<p class="text-sm text-gray-700">{benefit.description}</p>{/if}
          </Accordion>
        {/each}
      </div>
    </div>
    <div class="space-y-4">
      <h3>Our Values</h3>
      <div class="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {#each values as value, i}
          <Accordion title={value.title} open={i === 0}>
            {#if value.description}<p class="text-sm text-gray-700">{value.description}</p>{/if}
          </Accordion>
        {/each}
      </div>
    </div>
  </div>

  <div id="vacancies" class="space-y-4">
    <h3>Current vacancies</h3>
    <div class="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      {#if isClient}
        <iframe
          title="GetUp Careers"
          src="https://getup.recruiterbox.com/?embed=true"
          class="w-full min-h-[900px]"
          loading="lazy"
        ></iframe>
      {:else}
        <div class="p-6 text-center text-gray-600">Loading roles…</div>
      {/if}
    </div>
  </div>
</section>
