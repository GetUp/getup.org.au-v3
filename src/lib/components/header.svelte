<script lang="ts">
  // @ts-nocheck
  import Logo from "./logo.svelte";
  import PillarIcon from "./icons/pillar-icons.svelte";
  import { pillars } from "$lib/data/content";

  let {
    onOpenSignup = () => {},
    onOpenDonation = () => {},
  } = $props();

  let mobileMenuOpen = $state(false);

  const campaignPillars = pillars.filter((pillar) => pillar.slug !== "all");

  const navList = [
    { path: "/campaigns", label: "Campaigns", subNavList: campaignPillars },
    { path: "/about", label: "About" },
    { path: "/reports", label: "Reports" },
  ];
</script>

<nav class="relative z-50 bg-white border-b-2 border-gray-100">
  <div class="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center">
    <!-- Desktop Navigation -->
    <div class="hidden md:flex justify-between w-full gap-4">
      <div class="flex space-x-4 lg:space-x-8 font-medium">
        <a
          href="/"
          class="flex-shrink-0"
          style="width: 84px; padding: 0px 4px; margin-top: 3px;"
        >
          <Logo class="h-full w-full" />
        </a>

        {#each navList as item}
          <div class="relative flex items-center group">
            <a
              href={item.path}
              class="flex items-center space-x-1 py-4 hover:underline hover:text-(--color-purple)"
            >
              <span>{item.label}</span>
              {#if item.subNavList}
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              {/if}
            </a>

            {#if item.subNavList}
              <div
                class="hidden absolute z-50 top-12 -left-6 w-screen max-w-md ring-1 ring-black ring-opacity-5 rounded-lg shadow-lg px-6 py-3 bg-white group-hover:block"
              >
                {#each item.subNavList as pillar}
                  <a
                    href={`/campaigns#${pillar.slug}`}
                    class="flex space-x-2 items-start p-3 -mx-3 rounded-lg border border-gray-50 border-opacity-0 hover:bg-gray-50 hover:border-gray-200"
                  >
                    <PillarIcon slug={pillar.slug} />
                    <div>
                      <p>{pillar.heading}</p>
                      <p class="text-sm text-gray-400 font-normal">
                        {pillar.subhead}
                      </p>
                    </div>
                  </a>
                {/each}
                <a
                  href="/campaigns"
                  class="flex space-x-2 mt-2 items-start rounded-lg text-sm text-(--color-purple) hover:underline"
                >
                  <div>
                    <p class="flex items-center">
                      Show all campaigns
                      <svg
                        class="ml-2 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </p>
                  </div>
                </a>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <div class="flex space-x-3 lg:space-x-4 items-center font-medium">
        <button
          onclick={onOpenDonation}
          class="btn btn-sm btn-ghost whitespace-nowrap px-3 py-2 text-sm u-arrow"
        >
          Donate
        </button>
        <a
          href="https://petitions.getup.org.au"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-sm btn-primary whitespace-nowrap px-3 py-2 text-sm u-plus"
        >
          Start petition
        </a>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div class="flex md:hidden justify-between items-center w-full">
      <a
        href="/"
        class="flex-shrink-0"
        style="width: 84px; padding: 0px 4px; margin-top: 3px;"
      >
        <Logo class="h-full w-full" />
      </a>

      <div class="flex items-center space-x-3 ml-auto mr-4">
        <button
          onclick={onOpenDonation}
          class="btn btn-sm btn-ghost whitespace-nowrap text-xs px-2 u-arrow"
        >
          Donate
        </button>
        <a
          href="https://petitions.getup.org.au"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-sm btn-primary whitespace-nowrap text-xs px-2 u-plus"
        >
          Start petition
        </a>
      </div>

      <button type="button" onclick={() => (mobileMenuOpen = true)}>
        <span class="sr-only">Open menu</span>
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu Overlay -->
  {#if mobileMenuOpen}
    <button
      class="fixed inset-0 bg-black bg-opacity-50 z-40 w-full h-full border-0 p-0"
      onclick={() => (mobileMenuOpen = false)}
      aria-label="Close menu"
    ></button>
    <div
      class="fixed h-auto top-2 right-2 left-2 ring-1 ring-black ring-opacity-5 rounded-lg shadow-lg bg-white p-4 overflow-y-auto z-50"
      style="max-height: 95vh;"
    >
      <button
        type="button"
        class="flex ml-auto"
        onclick={() => (mobileMenuOpen = false)}
      >
        <span class="sr-only">Close menu</span>
        <svg
          class="h-6 w-6"
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

      {#each navList as navItem}
        {#if navItem.subNavList}
          <p class="uppercase text-sm text-gray-400">{navItem.label}</p>
          {#each navItem.subNavList as pillar}
            <a
              href={`/campaigns#${pillar.slug}`}
              class="flex space-x-2 items-start p-2.5 -mx-3 rounded-lg border border-gray-50 border-opacity-0 hover:bg-gray-50 hover:border-gray-200"
              onclick={() => (mobileMenuOpen = false)}
            >
              <PillarIcon slug={pillar.slug} />
              <div>
                <p>{pillar.heading}</p>
              </div>
            </a>
          {/each}
          <a
            href="/campaigns"
            class="flex space-x-2 mt-2 mb-4 items-start rounded-lg text-sm text-(--color-purple) hover:underline"
            onclick={() => (mobileMenuOpen = false)}
          >
            <div>
              <p class="flex items-center">
                Show all campaigns
                <svg
                  class="ml-2 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </p>
            </div>
          </a>
          <hr class="mt-4 mb-2" />
        {:else}
          <div class="relative flex items-center group">
            <a
              href={navItem.path}
              class="flex items-center w-full py-1.5 hover:underline hover:text-(--color-purple)"
              onclick={() => (mobileMenuOpen = false)}
            >
              <span>{navItem.label}</span>
            </a>
          </div>
        {/if}
      {/each}

      <a
        href="https://petitions.getup.org.au"
        target="_blank"
        rel="noopener noreferrer"
        onclick={() => { mobileMenuOpen = false; }}
        class="btn btn-primary text-base px-4 py-2 mt-4 w-full cursor-pointer u-plus"
      >
        Start petition
      </a>
      <button
        onclick={() => {
          onOpenDonation();
          mobileMenuOpen = false;
        }}
        class="flex items-center justify-center w-full py-3 mt-2 hover:underline hover:text-(--color-purple) u-arrow"
      >
        Donate
      </button>
    </div>
  {/if}
</nav>
<!-- @ts-nocheck -->
