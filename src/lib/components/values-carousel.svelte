<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let { items = [] } = $props();

  let currentIndex = $state(0);
  let autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  let isTransitioning = $state(false);
  let touchStartX = 0;
  let touchEndX = 0;

  const titles = ["Fair", "Flourishing", "Just"];

  function scrollToIndex(index: number) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = index;

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
    }, 10000);
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

  function onTouchStart(event: TouchEvent) {
    touchStartX = event.changedTouches[0].clientX;
  }

  function onTouchEnd(event: TouchEvent) {
    touchEndX = event.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    const threshold = 40;
    if (Math.abs(delta) > threshold) {
      delta > 0 ? prev() : next();
    }
    handleTouchEnd();
  }
</script>

<div class="relative bg-linear-to-l from-slate-900 to-slate-600">

  <!-- Navigation Handles -->
  <button
    onclick={prev}
    class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
    aria-label="Previous value"
  >
    <svg
      class="w-5 h-5 text-white"
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
    class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
    aria-label="Next value"
  >
    <svg
      class="w-5 h-5 text-white"
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
    class="fade-wrapper"
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
    ontouchstartcapture={handleTouchStart}
  >
    {#each items as item, i}
      <div
        class="fade-slide {currentIndex === i ? 'is-active' : ''}"
        aria-hidden={currentIndex !== i}
      >
        <div class="max-w-7xl mx-auto px-4 flex-1 flex flex-col">
          <div class="flex flex-col gap-4 flex-1">
            <div
              class="relative w-full h-64 rounded-lg shadow-2xl overflow-hidden shrink-0"
            >
              <img
                class="w-full h-full object-cover"
                src={item.image}
                alt={item.heading}
              />
              <div
                class="absolute inset-0 bg-black opacity-40 mix-blend-multiply"
              ></div>
            </div>
            <div class="text-center flex-1 flex flex-col justify-center">
              <h3
                class="font-subheader text-3xl text-white mb-3 uppercase"
                style="line-height: 1.2;"
              >
                <span
                  class="relative inline-block {currentIndex === 0
                    ? 'word-animate'
                    : ''}"
                >
                  <span
                    class={currentIndex === 0
                      ? "shimmer-text u-underlined active-underline"
                      : "text-white/80"}>Fair</span
                  >
                </span><span
                  class="text-xl text-white/60"
                  style="vertical-align: baseline;">,</span
                >
                <span> </span>
                <span
                  class="relative inline-block {currentIndex === 1
                    ? 'word-animate'
                    : ''}"
                >
                  <span
                    class={currentIndex === 1
                      ? "shimmer-text u-underlined active-underline"
                      : "text-white/80"}>Flourishing</span
                  >
                </span>
                <span
                  class="text-xl text-white"
                  style="vertical-align: 0.15em;"
                >
                  &
                </span>
                <span
                  class="relative inline-block {currentIndex === 2
                    ? 'word-animate'
                    : ''}"
                >
                  <span
                    class={currentIndex === 2
                      ? "shimmer-text u-underlined active-underline"
                      : "text-white/80"}>Just</span
                  >
                </span>
              </h3>
              <p class="text-xl text-white max-w-2xl mx-auto">{item.body}</p>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Dots Indicator -->
  <div class="flex justify-center gap-2 pt-4 pb-12">
    {#each items as _, i}
      <button
        onclick={() => scrollToIndex(i)}
        class="transition-all duration-300 {i === currentIndex
          ? 'w-10 h-2 dot-shimmer active-dot'
          : 'w-2 h-2 bg-white/30'} rounded-full"
        aria-label={`Go to ${titles[i]}`}
      ></button>
    {/each}
  </div>
</div>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .fade-wrapper {
    position: relative;
    overflow: hidden;
    min-height: 520px;
  }

  .fade-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 400ms ease-in-out;
    display: flex;
  }

  .fade-slide.is-active {
    opacity: 1;
    pointer-events: auto;
    position: relative;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .shimmer-text {
    background: linear-gradient(
      110deg,
      #cfd4dc 0%,
      #e4e7ec 20%,
      #ffffff 45%,
      #e4e7ec 70%,
      #cfd4dc 100%
    );
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 0.35px rgba(255, 255, 255, 0.35);
    animation: shimmer 6.5s ease-in-out infinite;
  }

  .dot-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.8) 25%,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0.8) 75%,
      rgba(255, 255, 255, 0.6) 100%
    );
    background-size: 200% 100%;
    animation: dot-shimmer 3s ease-in-out infinite;
  }

  .active-dot {
    animation: dot-pulse 1.2s ease-in-out infinite alternate;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35);
  }

  .word-animate {
    display: inline-block;
    animation: word-pulse-wiggle 5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: 300% 50%;
    }
    100% {
      background-position: -100% 50%;
    }
  }

  @keyframes dot-shimmer {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes dot-pulse {
    from {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.35);
    }
    to {
      transform: scale(1.08);
      box-shadow: 0 0 0 6px rgba(255, 255, 255, 0);
    }
  }

  :global(.active-underline.u-underlined::after) {
    animation: underline-pulse 2.8s ease-in-out infinite;
    transform-origin: left center;
  }

  @keyframes underline-pulse {
    0% {
      transform: translateY(-0.1em) scaleX(0.92);
      opacity: 0.85;
    }
    50% {
      transform: translateY(0) scaleX(1.05);
      opacity: 1;
    }
    100% {
      transform: translateY(-0.1em) scaleX(0.92);
      opacity: 0.85;
    }
  }

  @keyframes word-pulse-wiggle {
    0%,
    100% {
      transform: scale(1) rotate(0deg);
    }
    25% {
      transform: scale(1.02) rotate(-0.5deg);
    }
    50% {
      transform: scale(1.04) rotate(0.5deg);
    }
    75% {
      transform: scale(1.02) rotate(-0.5deg);
    }
  }
</style>
