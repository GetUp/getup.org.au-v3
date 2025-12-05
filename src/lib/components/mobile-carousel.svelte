<script>
  import { onMount, onDestroy } from "svelte";

  let { items = [], autoPlayInterval = 4000, children, itemsPerView = 1 } = $props();

  let currentGroupIndex = $state(0);
  let container;
  let autoPlayTimer;
  let isTransitioning = $state(false);
  const groupCount = $derived(Math.ceil(items.length / itemsPerView));

  function scrollToIndex(index) {
    if (!container || isTransitioning) return;

    isTransitioning = true;
    currentGroupIndex = index;

    const itemWidth = container.clientWidth / itemsPerView;
    const targetItemIndex = index * itemsPerView;

    container.scrollTo({
      left: itemWidth * targetItemIndex,
      behavior: "smooth",
    });

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  function next() {
    const nextIndex = (currentGroupIndex + 1) % groupCount;
    scrollToIndex(nextIndex);
  }

  function prev() {
    const prevIndex = currentGroupIndex === 0 ? groupCount - 1 : currentGroupIndex - 1;
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

    const itemWidth = container.clientWidth / itemsPerView;
    const newGroupIndex = Math.round((container.scrollLeft / itemWidth) / itemsPerView);

    if (newGroupIndex !== currentGroupIndex) {
      currentGroupIndex = newGroupIndex;
    }
  }
</script>

<div class="carousel">
  <!-- Carousel Container -->
  <div
    bind:this={container}
    onscroll={handleScroll}
    ontouchstart={handleTouchStart}
    ontouchend={handleTouchEnd}
    class="carousel__track"
  >
    {#each items as item, i (item.key || i)}
      <div
        class="carousel__slide"
        style={`flex: 0 0 ${100 / itemsPerView}%; max-width: ${100 / itemsPerView}%;`}
      >
        {@render children(item, i)}
      </div>
    {/each}
  </div>

  <!-- Navigation and Dots Indicator -->
  <div class="carousel__nav">
    <!-- Previous Button -->
    <button
      onclick={prev}
      class="carousel__nav-btn"
      aria-label="Previous"
    >
      <svg
        class="carousel__nav-icon"
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

    <!-- Dots -->
    <div class="carousel__dots">
      {#each Array(groupCount) as _, i}
        <button
          onclick={() => scrollToIndex(i)}
          class="carousel__dot {i === currentGroupIndex ? 'carousel__dot--active' : ''}"
          aria-label={`Go to slide ${i + 1}`}
        ></button>
      {/each}
    </div>

    <!-- Next Button -->
    <button
      onclick={next}
      class="carousel__nav-btn"
      aria-label="Next"
    >
      <svg
        class="carousel__nav-icon"
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
  </div>
</div>

<style>
  /* ==========================================================================
     Carousel Component
     ========================================================================== */

  .carousel {
    position: relative;
  }

  .carousel__track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    align-items: stretch;
    margin: 0 calc(-1 * var(--space-2));
    padding: 0 var(--space-2);
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .carousel__track::-webkit-scrollbar {
    display: none;
  }

  .carousel__slide {
    flex-shrink: 0;
    scroll-snap-align: start;
    padding: 0 var(--space-1);
    display: flex;
    min-height: 400px;
  }

  .carousel__slide > :global(*) {
    width: 100%;
    height: 100%;
  }

  /* Navigation */
  .carousel__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    margin-top: var(--space-4);
  }

  .carousel__nav-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .carousel__nav-btn:hover {
    transform: scale(1.1);
  }

  .carousel__nav-btn:active {
    transform: scale(0.95);
  }

  .carousel__nav-icon {
    width: 16px;
    height: 16px;
    color: var(--color-slate);
  }

  /* Dots */
  .carousel__dots {
    display: flex;
    gap: var(--space-2);
  }

  .carousel__dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--color-slate-300);
    border: none;
    cursor: pointer;
    transition: all var(--duration-normal) var(--ease-out);
  }

  .carousel__dot--active {
    width: 32px;
    background: var(--color-slate);
  }
</style>
