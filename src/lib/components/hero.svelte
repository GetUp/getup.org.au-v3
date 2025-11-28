<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Ticker from "./ticker.svelte";
  let { hero, onOpenSignup = () => {}, onOpenDonation = () => {} } = $props();

  const background = "/images/uploads/members-jumping-with-htvs.jpg";
  // Split title for mobile
  const title =
    hero?.title ||
    hero?.heading ||
    'People. Power. <span class="u-underlined u-underlined--white">Impact.</span>';

  const description =
    hero?.description ||
    "Join over a million GetUp members fighting for a fair, flourishing, and just Australia.";
  const primary = hero?.buttonPrimary ?? hero?.button;
  const secondary = hero?.buttonSecondary;

  let email = $state("");
  let postcode = $state("");
  let showDetailsDialog = $state(false);
  let firstName = $state("");
  let lastName = $state("");
  let phone = $state("");

  // Ticker state
  const TICKER_ENDPOINT = "https://api.getup.org.au/api/v1/campaign_stats.json";
  const DEFAULT_TICKER_TEXT = "67,980 Active Members in the last month";
  let tickerText = $state(DEFAULT_TICKER_TEXT);

  onMount(() => {
    fetch(TICKER_ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (data.count && data.label) {
          tickerText = `${data.count} ${data.label}`;
        } else if (data.text) {
          tickerText = data.text;
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch ticker data:", err);
      });
  });

  function handleInitialSubmit(e) {
    e.preventDefault();
    if (email) {
      // If we have full details from desktop form, submit directly
      if (firstName && lastName && postcode) {
        handleFinalSubmit(e);
      } else {
        showDetailsDialog = true;
      }
    }
  }

  function handleFinalSubmit(e) {
    e.preventDefault();
    // TODO: Submit to backend
    console.log({ email, postcode, firstName, lastName, phone });
    showDetailsDialog = false;
    // Reset form
    email = "";
    postcode = "";
    firstName = "";
    lastName = "";
    phone = "";
    goto("/welcome");
  }

  function skipDetails() {
    // TODO: Submit basic info to backend
    console.log({ email, postcode: "" }); // Postcode might be missing if skipped from mobile
    showDetailsDialog = false;
    email = "";
    goto("/welcome");
  }
</script>

<!-- Mobile Layout -->
<section
  class="flex flex-col md:hidden relative w-full overflow-hidden mb-0">
  <!-- Image Top -->
  <div class="h-[250px] w-full relative">
    <img
      src={background}
      class="w-full h-full object-cover object-top"
      alt="GetUp community members jumping with signs"
    />
    <Ticker className="absolute bottom-0 left-0 right-0 z-10" />
  </div>
  <!-- Orange Box Bottom -->
  <div
    class="max-h-[300px] w-full bg-(--color-orange) text-white flex flex-col justify-center items-center text-center gap-6 p-8"
  >
    <h1 class="text-5xl font-header tracking-tight leading-tight">
      People. Power. <span class="u-underlined u-underlined--white">Impact.</span>
    </h1>

    <p class="text-lg leading-snug max-w-sm">
      {description}
    </p>

    <form onsubmit={handleInitialSubmit} class="w-full max-w-sm flex gap-2">
      <input
        type="email"
        bind:value={email}
        placeholder="Your email"
        required
        class="flex-1 h-12 px-4 rounded-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white border-0 bg-white text-lg min-w-0"
      />
      <button
        type="submit"
        class="h-12 px-6 bg-(--color-purple) text-white font-bold uppercase tracking-wider rounded-sm hover:bg-(--color-purple-dark) transition-colors text-sm whitespace-nowrap"
      >
        Join
      </button>
    </form>
  </div>
</section>

<!-- Desktop: Side-by-side layout -->
<section
  class="hidden md:flex flex-row relative mx-auto mb-0 overflow-hidden w-full items-stretch min-h-[600px]"
>
  <!-- CTA Block - 40% -->
  <div
    class="w-[55%] lg:w-[45%] bg-(--color-orange) text-white p-12 flex flex-col justify-center items-stretch gap-10 z-10"
  >
    <div class="text-center">
      <h1 class="text-7xl tracking-tight font-header">
        {@html title.replace("Power.", "Power.<br/>").replace("  ", " ")}
      </h1>
    </div>

    <div class="text-center">
      <p class="text-3xl">{description}</p>
    </div>

    <form onsubmit={handleInitialSubmit} class="w-full max-w-2xl mx-auto">
      <!-- Full form from md and up -->
      <div class="grid grid-cols-[1.15fr_1fr] gap-4">
        <!-- Row 1: Names -->
        <input
          id="firstName-desktop"
          type="text"
          bind:value={firstName}
          placeholder="First name"
          tabindex="1"
          class="w-full h-14 px-4 rounded-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--color-purple) border border-gray-600 bg-gray-50 text-lg"
        />
        <input
          id="lastName-desktop"
          type="text"
          bind:value={lastName}
          placeholder="Last name"
          tabindex="2"
          class="w-full h-14 px-4 rounded-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--color-purple) border border-gray-600 bg-gray-50 text-lg"
        />

        <!-- Row 2: Email + Postcode/Join -->
        <input
          id="email-desktop"
          type="email"
          bind:value={email}
          placeholder="Your email"
          required
          tabindex="3"
          class="w-full h-14 px-4 rounded-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--color-purple) border border-gray-600 bg-gray-50 text-lg"
        />

        <div class="flex gap-4">
          <input
            id="postcode-desktop"
            type="text"
            bind:value={postcode}
            placeholder="Postcode"
            maxlength="4"
            tabindex="4"
            class="w-32 h-14 px-4 rounded-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--color-purple) border border-gray-600 bg-gray-50 text-lg shrink-0"
          />
          <button
            type="submit"
            tabindex="5"
            class="h-14 px-4 bg-(--color-purple) hover:bg-(--color-purple-dark) text-white font-extrabold rounded-sm transition-colors disabled:opacity-70 flex items-center justify-center grow text-xl leading-none u-arrow"
            aria-label="Join"
          ></button>
        </div>
      </div>
    </form>
  </div>

  <!-- Image + ticker - 60% -->
  <div class="w-[45%] lg:w-[55%] flex justify-center relative">
    <div class="absolute inset-0 bg-black/5">
      <img
        src={background}
        class="w-full h-full object-cover"
        alt="GetUp community members jumping with signs"
      />
    </div>
    <Ticker className="hidden md:flex z-20 absolute bottom-0 left-0 right-0" />
  </div>
</section>

<!-- Additional Details Dialog -->
{#if showDetailsDialog}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    onclick={() => (showDetailsDialog = false)}
  >
    <div
      class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-2xl font-bold text-slate-900">Almost there!</h2>
        <button
          onclick={() => (showDetailsDialog = false)}
          class="text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <p class="text-gray-600 mb-6">
        Help us personalize your GetUp experience by sharing a bit more about
        yourself (optional).
      </p>

      <form onsubmit={handleFinalSubmit} class="space-y-4">
        {#if !firstName}
          <div>
            <label
              for="firstName"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >First Name</label
            >
            <input
              id="firstName"
              type="text"
              bind:value={firstName}
              placeholder="Your first name"
              class="w-full h-12 px-3 rounded border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-purple) focus:border-transparent"
            />
          </div>
        {/if}

        {#if !lastName}
          <div>
            <label
              for="lastName"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >Last Name</label
            >
            <input
              id="lastName"
              type="text"
              bind:value={lastName}
              placeholder="Your last name"
              class="w-full h-12 px-3 rounded border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-purple) focus:border-transparent"
            />
          </div>
        {/if}

        {#if !postcode}
          <div>
            <label
              for="postcode-modal"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >Postcode</label
            >
            <input
              id="postcode-modal"
              type="text"
              bind:value={postcode}
              placeholder="Postcode"
              maxlength="4"
              class="w-full h-12 px-3 rounded border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-purple) focus:border-transparent"
            />
          </div>
        {/if}

        <div>
          <label
            for="phone"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Phone Number</label
          >
          <input
            id="phone"
            type="tel"
            bind:value={phone}
            placeholder="Your phone number"
            class="w-full h-12 px-3 rounded border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--color-purple) focus:border-transparent"
          />
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onclick={skipDetails}
            class="flex-1 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded transition-colors"
          >
            Skip
          </button>
          <button
            type="submit"
            class="flex-1 h-12 bg-(--color-purple) hover:bg-(--color-purple-dark) text-white font-semibold rounded transition-colors"
          >
            Complete
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
<!-- @ts-nocheck -->
