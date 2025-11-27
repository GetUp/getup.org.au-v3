<script>
  import { onMount, onDestroy } from "svelte";

  let { items = [], autoPlayInterval = 4000, children } = $props();

  let currentIndex = $state(0);
  let container;
  let autoPlayTimer;
  let isTransitioning = $state(false);
  let direction = $state(1); // 1 for forward, -1 for backward

  function scrollToIndex(index) {
    if (!container || isTransitioning) return;

    isTransitioning = true;
    currentIndex = index;

    const scrollWidth = container.scrollWidth;
    const itemWidth = scrollWidth / items.length;

    container.scrollTo({
      left: itemWidth * index,
      behavior: "smooth",
    });

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  function next() {
    const nextIndex = (currentIndex + 1) % items.length;
    scrollToIndex(nextIndex);
  }

  function prev() {
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      next();
    }, autoPlayInterval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  onMount(() => {
    startAutoPlay();
  });

  onDestroy(() => {
    stopAutoPlay();
  });

  function handleTouchStart() {
    stopAutoPlay();
  }

  function handleTouchEnd() {
    startAutoPlay();
  }

  function handleScroll() {
    if (isTransitioning || !container) return;

    const scrollWidth = container.scrollWidth;
    const itemWidth = scrollWidth / items.length;
    const newIndex = Math.round(container.scrollLeft / itemWidth);

    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
    }
  }
</script>

<div class="relative">
  <!-- Navigation Handles -->
  <button
    onclick={prev}
    disabled={currentIndex === 0}
    class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:scale-110 active:scale-95"
    aria-label="Previous"
  >
    <svg
      class="w-5 h-5 text-slate-900"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M15 19l-7-7 7-7"
      />
    </svg>
  </button>

  <button
    onclick={next}
    disabled={currentIndex === items.length - 1}
    class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:scale-110 active:scale-95"
    aria-label="Next"
  >
    <svg
      class="w-5 h-5 text-slate-900"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>

  <!-- Carousel Container -->
  <div
    bind:this={container}
    onscroll={handleScroll}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
    class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
    style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;"
  >
    {#each items as item, i}
      <div class="shrink-0 w-full snap-center px-2">
        {@render children(item, i)}
      </div>
    {/each}
  </div>

  <!-- Dots Indicator -->
  <div class="flex justify-center gap-2 mt-4">
    {#each items as _, i}
      <button
        onclick={() => scrollToIndex(i)}
        class="transition-all duration-300 {i === currentIndex
          ? 'w-8 h-2 bg-slate-900'
          : 'w-2 h-2 bg-slate-300'} rounded-full"
        aria-label={`Go to slide ${i + 1}`}
      ></button>
    {/each}
  </div>
</div>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
