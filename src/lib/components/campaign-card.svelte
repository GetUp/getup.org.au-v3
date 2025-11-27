<script>
  // Flexible campaign card that supports both the dark hero/home layout and the light
  // list layout (horizontal or vertical). It normalises common campaign fields so
  // data from different sources can be dropped in with minimal props.
  let {
    campaign,
    className = "",
    truncate = false,
    showActionButton = false,
    isFeatured = false,
    isOther = false,
    isMobile = false,
    layout = "vertical", // "vertical" (default/home) or "horizontal" (list view)
    variant = "dark", // "dark" (home) or "light" (campaigns/take-action)
    badgeColor = "bg-(--color-orange)",
  } = $props();

  const href = campaign?.href || campaign?.link || campaign?.path || "#";
  const title = campaign?.title || campaign?.heading || "Untitled campaign";
  const image = campaign?.image;
  const excerpt = campaign?.excerpt || campaign?.description;
  const badge = campaign?.badge || (campaign?.featured ? "Featured" : undefined);
  const category = campaign?.category || campaign?.pillar;

  const shouldOpenInNewTab =
    campaign?.newTab ?? (/^https?:\/\//.test(href) && !href.startsWith("/"));
  const rel = shouldOpenInNewTab ? "noopener noreferrer" : undefined;

  const tone =
    variant === "light"
      ? {
          card: "bg-white text-slate shadow-lg hover:shadow-xl",
          title: "text-slate",
          copy: "text-gray-700",
          hint: "text-(--color-orange)",
        }
      : {
          card: "bg-slate-900 text-white shadow hover:shadow-lg",
          title: "text-white",
          copy: "text-white",
          hint: "text-white",
        };

  const titleSize = truncate ? "text-xl line-clamp-1" : "text-2xl";
  const excerptClamp = truncate ? "line-clamp-2" : isMobile ? "line-clamp-6" : "line-clamp-6";
  const showClickHint = isOther && !isMobile;
  const showCtaRow = layout === "horizontal" || isFeatured || (showActionButton && !isMobile);
</script>

<a
  {href}
  class={`group rounded overflow-hidden transition-shadow flex ${layout === "horizontal" ? "flex-col md:flex-row h-full" : "flex-col h-full"} ${tone.card} ${className}`}
  target={shouldOpenInNewTab ? "_blank" : undefined}
  rel={rel}
>
  <div class={`relative overflow-hidden ${layout === "horizontal" ? "md:w-64 lg:w-72 shrink-0" : ""}`}>
    <div class={layout === "horizontal" ? "aspect-video md:aspect-[4/3] overflow-hidden" : "h-60 md:h-72 overflow-hidden"}>
      {#if image}
        <img
          src={image}
          alt={title}
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      {:else}
        <div class="w-full h-full bg-gray-100"></div>
      {/if}
    </div>
    {#if badge}
      <span class={`absolute top-3 right-3 ${badgeColor} text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow`}>
        {badge}
      </span>
    {/if}
    {#if category}
      <span class="absolute bottom-3 left-3 bg-black/70 text-white text-[11px] font-medium px-3 py-1 rounded">
        {category}
      </span>
    {/if}
  </div>

  <div class={`flex flex-col flex-1 ${layout === "horizontal" ? "p-5 md:p-6 space-y-3" : "p-6"}`}>
    {#if !isMobile}
      <h3 class={`font-subheader mb-2 leading-tight ${titleSize} ${tone.title}`}>
        {title}
      </h3>
    {/if}

    {#if excerpt}
      <p class={`text-base ${tone.copy} ${excerptClamp}`}>
        {excerpt}
      </p>
      {#if showClickHint}
        <p class="text-sm font-bold uppercase mt-2 text-right">CLICK FOR MORE</p>
      {/if}
    {/if}

    {#if showCtaRow}
      <div class="mt-auto pt-3">
        {#if isFeatured || showActionButton}
          <span class="btn btn-primary w-full text-center inline-flex justify-center">Act now</span>
        {:else}
          <div class={`flex items-center gap-2 font-semibold text-sm ${tone.hint}`}>
            <span>Take action</span>
            <span aria-hidden="true">→</span>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</a>
