<script>
  import { onMount } from "svelte";

  let cmsLoaded = $state(false);

  const packageUrl = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";

  onMount(() => {
    // Ensure manual init so Decap doesn't auto-mount with a missing default config
    window.CMS_MANUAL_INIT = true;

    // Point Decap at the local config file
    const configLink = document.createElement("link");
    configLink.rel = "cms-config-url";
    configLink.href = "/config.yml";
    document.head.appendChild(configLink);

    const script = document.createElement("script");
    script.src = packageUrl;
    script.onload = () => {
      if (window.CMS) {
        window.CMS.init({
          config: {
            load_config_file: true,
            config: "/config.yml",
          },
        });
      }
      cmsLoaded = true;
    };
    document.head.appendChild(script);
  });
</script>

<svelte:head>
  <title>Content Management - GetUp Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="pt-16 px-4 md:px-6 lg:px-8">
  <div id="nc-root" class="min-h-screen"></div>

  {#if !cmsLoaded}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange"
        ></div>
        <p class="mt-4 text-slate">Loading CMS...</p>
      </div>
    </div>
  {/if}
</main>
