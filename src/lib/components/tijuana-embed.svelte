<script>
  import { onMount } from "svelte";

  // Use this to embed TJ pages with the `embed` tag so query params propagate
  // and iframe-resizer can communicate size.
  let { src } = $props();

  let iframeElement = $state(null);

  onMount(async () => {
    if (!iframeElement || typeof window === "undefined") return;

    // Set the iframe src first
    iframeElement.src = src + window.location.search;

    // Lazy-load iframe-resizer to avoid SSR window usage
    try {
      const iframeResizeModule = await import("@iframe-resizer/parent");
      const iframeResize = iframeResizeModule.default;
      if (iframeResize) {
        iframeResize({ license: 'GPLv3' }, iframeElement);
      }
    } catch (error) {
      console.warn("Failed to initialize iframe-resizer:", error);
    }
  });
</script>

<iframe
  bind:this={iframeElement}
  id="embed"
  data-embed-src={src}
  style="width: 1px; min-width: 100%; min-height: 500px; border: none;"
  title="Embedded content"
></iframe>
