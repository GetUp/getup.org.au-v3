<script lang="ts">
  import { page } from "$app/stores";
  import SidebarSubmenu from "$lib/components/sidebar-submenu.svelte";
  import { aboutContent } from "$lib/data/content";

  let { children } = $props();

  const navItems = [
    { label: "Overview", href: "/about" },
    { label: "Board", href: "/about/board" },
    { label: "Work at GetUp", href: "/about/work-at-getup" },
    { label: "Reports", href: "/about/reports" },
    { label: "FAQs", href: "/about/faqs" },
    { label: "Transparency", href: "/about/transparency" }
  ];

  const isActive = (href: string, current: string) =>
    current === href || (href !== "/about" && current.startsWith(href));

  const currentPath = $derived($page.url.pathname);
  const activeNav = $derived(navItems.find((item) => isActive(item.href, currentPath)) ?? navItems[0]);
  const heroTitle = $derived(aboutContent.header.heading);
  const heroSubhead = $derived(aboutContent.header.subhead);
  const heroImage = $derived(aboutContent.header.image);
</script>

<main class="bg-white min-h-screen">
  <section class="relative overflow-hidden bg-(--color-orange)">
    <div class="absolute inset-0">
      {#if heroImage}
        <img src={heroImage} alt={heroTitle} class="w-full h-full object-cover" loading="lazy" />
      {/if}
      <div class="absolute inset-0 bg-gradient-to-r from-orange-900/70 via-orange-800/60 to-orange-700/70"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 relative text-white">
      <div class="flex justify-between items-start gap-4">
        <div class="space-y-2 max-w-3xl">
          <p class="uppercase text-xs font-semibold tracking-[0.3em]">About GetUp</p>
          <h1 class="text-3xl md:text-5xl font-black leading-tight">{heroTitle}</h1>
          <p class="text-lg md:text-xl">{heroSubhead}</p>
        </div>
        <div class="lg:hidden">
          <SidebarSubmenu
            items={navItems}
            mobileLayout="header"
            headerSelector="section"
          />
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 lg:py-14">
    <div class="lg:flex lg:gap-12">
      <div class="hidden lg:block">
        <SidebarSubmenu items={navItems} mobileLayout="header" headerSelector="section" />
      </div>
      <section class="flex-1 space-y-10">
        {@render children()}
      </section>
    </div>
  </section>
</main>
