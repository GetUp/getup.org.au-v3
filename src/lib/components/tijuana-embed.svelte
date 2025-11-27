<script>
  import { onMount } from "svelte";

  // Use this to embed TJ pages with the `embed` tag so query params propagate
  // and iframe-resizer can communicate size.
  let { src } = $props();

  let iframeElement = $state(null);

  onMount(async () => {
    if (!iframeElement || typeof window === "undefined") return;
    // Lazy-load to avoid SSR window usage; handle default/named export shapes
    const mod = await import("iframe-resizer/js/iframeResizer");
    const iframeResize = mod?.iframeResizer || mod?.default;
    if (!iframeResize) return;

    iframeElement.src = src + window.location.search;
    iframeResize({}, iframeElement);
  });
</script>

<iframe
  bind:this={iframeElement}
  id="embed"
  data-embed-src={src}
  style="width: 1px; min-width: 100%; min-height: 500px; border: none;"
  title="Embedded content"
></iframe>
