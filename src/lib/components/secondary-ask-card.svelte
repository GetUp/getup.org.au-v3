<script>
  let { data, variant = "light", isMobile = false } = $props();

  const heading = data.heading || "Join the GetUp crew!";
  const body = data.body || [];
  const link = data.link || "/donate/crew";
  const button = data.button || "Step up. Power change.";

  const isDark = variant === "dark";
</script>

<div
  class="{isDark
    ? 'bg-slate-900 text-white'
    : 'bg-gray-100 text-black'} p-6 shadow text-base rounded flex flex-col h-full justify-center"
>
  <p
    class="font-subheader text-3xl mb-4 text-center uppercase {isDark
      ? 'text-white'
      : 'text-(--color-orange)'}"
  >
    {heading}
  </p>

  <div class={isMobile ? "overflow-hidden" : ""}>
    {#each isMobile ? body.slice(0, 1) : body as paragraph}
      <p class="mb-4">{paragraph}</p>
    {/each}
  </div>

  <div class="mt-auto flex justify-center w-full">
    <a
      href={link}
      class="btn btn-primary text-base w-full md:w-auto {isMobile
        ? 'py-4 text-lg'
        : ''}"
    >
      {button}
    </a>
  </div>
</div>
