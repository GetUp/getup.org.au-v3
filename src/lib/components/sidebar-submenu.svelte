<script lang="ts">
  import { onMount } from "svelte";

  let {
    items = [],
    activeHref = "",
    position = "left",
    sticky = true,
    className = "",
    mobileLayout = "handle", // 'handle' | 'header'
    headerSelector = "",
  } = $props();

  let isOpen = $state(false);
  let isHeaderVisible = $state(true);
  let showTocNub = $state(false);
  let isNarrow = $state(false);

  function isActive(href: string, exact: boolean = false) {
    if (!activeHref) return false;
    if (exact) return activeHref === href;
    return activeHref === href || activeHref.startsWith(href + "/");
  }

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
  }

  onMount(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handleMq = () => (isNarrow = mq.matches);
    handleMq();
    mq.addEventListener("change", handleMq);

    if (
      (mobileLayout === "header" || mobileLayout === "handle") &&
      headerSelector
    ) {
      const header = document.querySelector(headerSelector);
      if (header) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            isHeaderVisible = entry.isIntersecting;
          },
          { threshold: 0 },
        );
        observer.observe(header);
        return () => {
          observer.disconnect();
          mq.removeEventListener("change", handleMq);
        };
      }
    }

    if (mobileLayout === "handle") {
      showTocNub = true;
    }

    return () => mq.removeEventListener("change", handleMq);
  });
</script>

<!-- Mobile Triggers -->
{#if mobileLayout === "handle" && isNarrow}
  <button
    class={`sidebar-handle z-100 lg:hidden ${showTocNub ? "sidebar-handle--pinned" : ""}`}
    onclick={toggle}
    aria-expanded={isOpen}
    aria-label="Toggle navigation"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {#if isOpen}
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      {:else}
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      {/if}
    </svg>
  </button>
{:else if mobileLayout === "header" && isNarrow}
  <!-- In-Header Trigger -->
  <button
    class="header-dropdown-trigger {isHeaderVisible
      ? 'opacity-100 pointer-events-auto'
      : 'opacity-0 pointer-events-none'}"
    onclick={toggle}
    aria-expanded={isOpen}
    aria-label="Toggle navigation"
  >
    <span class="mr-2 font-semibold text-sm hidden sm:inline-block"
      >Jump to section</span
    >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  </button>

  <!-- Sticky Bar (When header is hidden) -->
  <div
    class="sticky-dropdown-bar {isHeaderVisible
      ? 'translate-y-[-100%]'
      : 'translate-y-0'}"
  >
    <span class="font-bold text-sm text-slate-700">Jump to section</span>
    <button
      class="p-2 -mr-2 text-slate-700 hover:text-orange-500 transition-colors"
      onclick={toggle}
      aria-label="Open menu"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    </button>
  </div>
{/if}

<!-- Backdrop -->
{#if isOpen}
  <div class="sidebar-backdrop" onclick={close} role="presentation"></div>
{/if}

<aside
  class="sidebar-submenu {position === 'right'
    ? 'sidebar-submenu--right'
    : ''} {sticky ? 'sidebar-submenu--sticky' : ''} {className} {isOpen
    ? 'is-open'
    : ''}"
>
  <nav>
    <ul class="sidebar-submenu-list text-slate-900">
      {#each items as item}
        <li>
          <a
            href={item.href}
            class="sidebar-submenu-link {isActive(item.href, item.exact)
              ? 'sidebar-submenu-link--active'
              : ''}"
            onclick={close}
          >
            <span class="sidebar-parent-label">{item.label}</span>
          </a>

          {#if item.children && item.children.length > 0}
            <ul class="sidebar-submenu-children">
              {#each item.children as child}
                <li>
                  <a
                    href={child.href}
                    class="sidebar-submenu-child-link {isActive(
                      child.href,
                      child.exact,
                    )
                      ? 'sidebar-submenu-child-link--active'
                      : ''}"
                    onclick={close}
                  >
                    <span class="text-slate-900">{child.label}</span>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<style>
  .sidebar-submenu {
    width: 240px;
    padding: 1.5rem 0;
  }

  .sidebar-submenu--sticky {
    position: sticky;
    top: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }

  .sidebar-submenu--sticky::-webkit-scrollbar {
    width: 4px;
  }

  .sidebar-submenu--sticky::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar-submenu--sticky::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }

  .sidebar-submenu--sticky::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  .sidebar-submenu-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: var(--color-slate);
  }

  .sidebar-submenu-link {
    display: block;
    padding: 0.5rem 0.25rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-slate);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .sidebar-submenu-link:hover {
    color: var(--color-orange);
  }

  .sidebar-submenu-link--active {
    color: var(--color-orange);
  }

  .sidebar-parent-label {
    display: inline-block;
  }

  .sidebar-submenu-children {
    list-style: none;
    margin: 0.25rem 0 0.5rem 0;
    padding: 0 0 0 0.35rem;
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }

  .sidebar-submenu-child-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0 0.35rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-slate-light);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .sidebar-submenu-child-link::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-orange);
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .sidebar-submenu-child-link:hover {
    color: var(--color-orange);
  }

  .sidebar-submenu-child-link:hover::before {
    opacity: 0.6;
  }

  .sidebar-submenu-child-link--active {
    color: var(--color-orange);
    font-weight: 600;
  }

  .sidebar-submenu-child-link--active::before {
    opacity: 1;
    transform: scale(1);
  }

  /* Handle & Backdrop (Hidden on Desktop) */
  .sidebar-handle,
  .header-dropdown-trigger,
  .sticky-dropdown-bar,
  .sidebar-backdrop {
    display: none;
  }

  /* Mobile Styles */
  @media (max-width: 1023px) {
    .sidebar-submenu {
      position: fixed;
      bottom: 5.5rem; /* Space for handle */
      left: 1rem;
      width: calc(100% - 2rem);
      max-width: 300px;
      background: white;
      border-radius: 12px;
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.15),
        0 4px 10px rgba(0, 0, 0, 0.05);
      z-index: 50;
      padding: 1rem 0;

      /* Animation state */
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      /* Reset sticky props for mobile */
      top: auto;
      height: auto;
      max-height: 60vh;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .sidebar-submenu.is-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* Handle Mode */
    .sidebar-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      bottom: 1.5rem;
      left: 1.5rem;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: var(--color-purple, #7c3aed);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(75, 70, 213, 0.4);
      z-index: 51;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .sidebar-handle:active {
      transform: scale(0.9);
    }

    /* Header Mode */
    .header-dropdown-trigger {
      display: flex;
      align-items: center;
      color: white;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s ease;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .header-dropdown-trigger:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .sticky-dropdown-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: white;
      padding: 0.75rem 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      z-index: 48; /* Below backdrop (49) and menu (50) */
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .sidebar-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      z-index: 49;
      animation: fade-in 0.2s ease;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
