<script>
  import { onMount } from "svelte";
  import LogoMarkExclaim from "./logo-mark-exclaim.svelte";

  const TICKER_ENDPOINT = "https://api.getup.org.au/api/v1/campaign_stats.json";
  const DEFAULT_TEXT = "67,980 Active Members in the last month";
  const PX_PER_SECOND = 60; // keep scroll speed consistent across screen sizes

  let text = $state(DEFAULT_TEXT);
  let animationDuration = $state(30);
  let tickerEl;

  const updateDuration = () => {
    if (!tickerEl) return;
    const width = tickerEl.scrollWidth;
    // Clamp to avoid overly short durations on tiny widths
    animationDuration = Math.max(width / PX_PER_SECOND, 12);
  };

  onMount(() => {
    updateDuration();

    const resizeObserver = new ResizeObserver(updateDuration);
    resizeObserver.observe(tickerEl);
    window.addEventListener("resize", updateDuration);

    fetch(TICKER_ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (data.count && data.label) {
          text = `${data.count} ${data.label}`;
        } else if (data.text) {
          text = data.text;
        }
      })
      .catch((err) => {
        // Silently fail and use default text
        console.warn("Failed to fetch ticker data:", err);
      });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDuration);
    };
  });

  // Create enough duplicates to ensure smooth scrolling
  const items = Array(10).fill(null);

  let { className = "" } = $props();
</script>

<div
  class="w-full bg-(--color-slate) text-white py-3 overflow-hidden shadow-lg {className}"
>
  <div
    class="animate-ticker flex whitespace-nowrap items-center gap-4 font-bold tracking-widest text-sm md:text-base uppercase"
    bind:this={tickerEl}
    style={`animation-duration: ${animationDuration}s;`}
  >
    {#each items as _, i}
      <span>{text}</span>
      <span class="inline-flex items-center">
        <LogoMarkExclaim class="h-4 w-auto" />
      </span>
    {/each}
  </div>
</div>
