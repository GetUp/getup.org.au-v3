<script>
  import { marked } from "marked";
  import TijuanaEmbed from "$lib/components/tijuana-embed.svelte";
  import FreshdeskEmbed from "$lib/components/freshdesk-embed.svelte";

  let { data } = $props();
  const page = data.page;

  // Split content by embed pattern: @[src]
  // Result is array of objects: { type: 'text'|'embed'|'freshdesk', content: string, path?: string, config?: object }
  const contentParts = $derived.by(() => {
    const raw = page.body || "";
    const regex = /@\[(.*?)\]/g;
    let lastIndex = 0;
    const parts = [];
    let match;

    while ((match = regex.exec(raw)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: raw.slice(lastIndex, match.index),
        });
      }

      const inside = match[1];
      if (inside.startsWith("freshdesk:")) {
        let config = {};
        try {
          config = JSON.parse(inside.replace("freshdesk:", ""));
        } catch (e) {
          console.error("Failed to parse Freshdesk config", e);
        }
        parts.push({
          type: "freshdesk",
          config: config,
        });
      } else {
        // Generic Embed
        parts.push({
          type: "embed",
          path: inside,
        });
      }
      lastIndex = regex.lastIndex;
    }
    // Remaining text
    if (lastIndex < raw.length) {
      parts.push({
        type: "text",
        content: raw.slice(lastIndex),
      });
    }
    return parts;
  });
</script>

<svelte:head>
  <title>{page.title} - GetUp</title>
</svelte:head>

{#if page.layout === "header"}
  <!-- Layout: Header Image (About Style) -->
  <header
    class="relative bg-slate-900 text-white py-16 md:py-24 overflow-hidden"
  >
    {#if page.header_image}
      <div class="absolute inset-0 z-0">
        <img
          src={page.header_image}
          alt=""
          class="w-full h-full object-cover opacity-30"
        />
      </div>
    {/if}
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1
        class="text-4xl md:text-6xl font-display font-bold leading-tight mb-4"
      >
        {page.title}
      </h1>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12 md:py-16">
    <div class="prose prose-lg prose-slate max-w-none">
      {#each contentParts as part}
        {#if part.type === "text"}
          {@html marked.parse(part.content)}
        {:else if part.type === "embed"}
          <div class="not-prose my-8">
            <TijuanaEmbed src={part.path} />
          </div>
        {:else if part.type === "freshdesk"}
          <div class="not-prose my-8">
            <FreshdeskEmbed
              title={part.config.title}
              submitLabel={part.config.submit_label}
              submitThanks={part.config.submit_thanks}
              height={part.config.height}
            />
          </div>
        {/if}
      {/each}
    </div>
  </main>
{:else}
  <!-- Layout: Simple (White Background) -->
  <main class="max-w-4xl mx-auto px-4 py-12 md:py-16 min-h-screen">
    <h1
      class="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8 border-b pb-4"
    >
      {page.title}
    </h1>
    <div class="prose prose-lg prose-slate max-w-none">
      {#each contentParts as part}
        {#if part.type === "text"}
          {@html marked.parse(part.content)}
        {:else if part.type === "embed"}
          <div class="not-prose my-8">
            <TijuanaEmbed src={part.path} />
          </div>
        {:else if part.type === "freshdesk"}
          <div class="not-prose my-8">
            <FreshdeskEmbed
              title={part.config.title}
              submitLabel={part.config.submit_label}
              submitThanks={part.config.submit_thanks}
              height={part.config.height}
            />
          </div>
        {/if}
      {/each}
    </div>
  </main>
{/if}

<style>
  :global(details.cms-accordion) {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    background-color: white;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  :global(details.cms-accordion > summary) {
    padding: 1rem;
    font-weight: 400;
    cursor: pointer;
    list-style: none; /* Hide default triangle */
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #0f172a;
    font-family: var(--font-display);
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  /* Custom triangle indicator */
  :global(details.cms-accordion > summary::after) {
    content: "+";
    font-size: 1.5rem;
    line-height: 1;
    font-weight: 400;
    color: var(--color-orange);
    transition-property: transform;
    transition-duration: 200ms;
  }

  :global(details.cms-accordion[open] > summary::after) {
    transform: rotate(45deg);
  }

  :global(details.cms-accordion > .cms-accordion-content) {
    padding: 0 1rem 1rem 1rem;
    border-top: 1px solid #f1f5f9;
    color: #374151;
    margin-top: 0.5rem;
  }

  /* Remove default marker in some browsers */
  :global(details.cms-accordion > summary::-webkit-details-marker) {
    display: none;
  }
</style>
