<script lang="ts">
  import { getContext } from "svelte";
  import Hero from "$lib/components/home/hero.svelte";
  import TakeActionSection from "$lib/components/home/take-action-section.svelte";
  import GetInvolvedSection from "$lib/components/home/get-involved-section.svelte";
  import ImpactSection from "$lib/components/home/impact-section.svelte";
  import MovementSection from "$lib/components/home/movement-section.svelte";
  import { homeContent, takeActionLists } from "$lib/data/content";
  import campaignsSettings from "../../content/settings/campaigns.json";
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  type ModalsContext = { openSignup: () => void };
  const modals = getContext<ModalsContext>("modals");

  let showMobileBar = $state(true);
  let cbmPetitions = $state([]);

  const scrollToTakeAction = () => {
    if (typeof document === "undefined") return;
    const el = document.getElementById("take-action");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleScroll = () => {
    if (typeof window === "undefined") return;
    showMobileBar = window.scrollY < 10;
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Client-side JSONP fetch for CBM petitions
    const cbmCount = campaignsSettings.cbmCount || 3;
    const script = document.createElement("script");
    const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());

    // Define global callback
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);

      const list = Array.isArray(data) ? data : data.data || data.results || [];
      cbmPetitions = list.slice(0, cbmCount).map((p: any) => ({
        title: p.title,
        excerpt: p.blurb || p.description || p.summary || p.overview || p.what || p.content || p.body || p.text || "Community-driven petition to create change.",
        description: p.blurb || p.description || p.summary || p.overview || p.what || p.content || p.body || p.text || "Community-driven petition to create change.",
        image: p.image_url?.replace("http://", "https://") || null,
        href: p.url,
        link: p.url,
        pillar: "community-run",
        slug: `cbm-${p.slug || p.id}`,
        isCbm: true,
        status: "none",
      }));
    };

    script.src = `https://petitions.getup.org.au/petitions/featured.json?callback=${callbackName}`;
    document.body.appendChild(script);
  });

  onDestroy(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("scroll", handleScroll);
  });
</script>

<svelte:head>
  <title>{homeContent?.header?.title ?? "GetUp"}</title>
  <meta
    name="description"
    content={homeContent?.header?.description ??
      "Join over a million GetUp members fighting for a fair, flourishing, and just Australia."}
  />
</svelte:head>

<main
  class="snap-y snap-mandatory md:snap-none overflow-y-auto md:overflow-visible min-h-[calc(100vh-64px)] md:min-h-screen"
>
  <!-- Hero Section -->
  <div class="snap-center md:snap-none">
    <Hero hero={homeContent.hero} onOpenSignup={modals.openSignup} />
  </div>

  <!-- Mobile scroll prompt -->
  {#if showMobileBar}
    <button
      type="button"
      transition:fade={{ duration: 200 }}
      class="scroll-prompt md:hidden"
      onclick={scrollToTakeAction}
      aria-label="Scroll to campaigns"
    >
      <span class="scroll-prompt__text">See current campaigns</span>
      <svg class="scroll-prompt__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  {/if}

  <!-- Take Action Now Section -->
  <div class="snap-center md:snap-none">
    <TakeActionSection
      heading={homeContent.takeActionNow.heading}
      top={takeActionLists.top}
      featured={[...cbmPetitions, ...takeActionLists.featured]}
      secondaryAsk={homeContent.takeActionNow.secondaryAsk}
    />
  </div>

  <!-- Get Involved Section -->
  <div class="snap-center md:snap-none">
    <GetInvolvedSection content={homeContent.getInvolved} />
  </div>

  <!-- Movement Section - Social proof with rally imagery -->
  <div class="snap-center md:snap-none">
    <MovementSection data={homeContent.mission} />
  </div>

  <!-- Impact Section - Stats and transparency -->
  <div class="snap-center md:snap-none">
    <ImpactSection data={homeContent.whatIsGetUp} />
  </div>

  <!-- Footer Image -->
  <!-- {#if homeContent.footer?.image}
    <img
      class="w-full object-cover"
      style="max-height: 72vh;"
      src={homeContent.footer.image}
      alt="GetUp community in action"
    />
  {/if} -->
</main>

<style>
  .scroll-prompt {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: linear-gradient(to top, var(--color-slate, #1e293b) 0%, var(--color-slate, #1e293b) 60%, transparent 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-family: var(--font-subheader);
    min-height: 5rem;
  }

  .scroll-prompt__text {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.025em;
    text-transform: uppercase;
  }

  .scroll-prompt__icon {
    width: 1.5rem;
    height: 1.5rem;
    animation: bounce 1.5s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(4px);
    }
  }
</style>

