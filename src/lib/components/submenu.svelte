<script>
  let {
    items = [],
    activeHref = '',
    sticky = false,
    className = ''
  } = $props();

  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  function isActive(href) {
    if (!activeHref) return false;
    return activeHref === href || activeHref.startsWith(href + '/');
  }
</script>

<nav class="submenu {sticky ? 'submenu--sticky' : ''} {className}">
  <!-- Desktop Navigation -->
  <div class="hidden md:block bg-white border-b border-gray-200">
    <div class="container mx-auto">
      <ul class="flex items-center gap-1">
        {#each items as item}
          <li>
            <a
              href={item.href}
              class="submenu-link {isActive(item.href) ? 'submenu-link--active' : ''}"
            >
              {#if item.icon}
                <svelte:component this={item.icon} size={18} />
              {/if}
              <span>{item.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Mobile Navigation -->
  <div class="md:hidden bg-white border-b border-gray-200">
    <div class="container mx-auto">
      <div class="flex items-center justify-between py-3">
        <button
          onclick={toggleMobileMenu}
          class="submenu-mobile-toggle"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span class="font-semibold text-slate-900">
            {items.find(item => isActive(item.href))?.label || 'Menu'}
          </span>
          <svg
            class="w-5 h-5 transition-transform {mobileMenuOpen ? 'rotate-180' : ''}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {#if mobileMenuOpen}
        <ul class="submenu-mobile-list">
          {#each items as item}
            <li>
              <a
                href={item.href}
                onclick={closeMobileMenu}
                class="submenu-mobile-link {isActive(item.href) ? 'submenu-mobile-link--active' : ''}"
              >
                {#if item.icon}
                  <svelte:component this={item.icon} size={20} />
                {/if}
                <span>{item.label}</span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</nav>

<style>
  .submenu--sticky {
    position: sticky;
    top: 0;
    z-index: 40;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .submenu-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--color-slate);
    text-decoration: none;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;
  }

  .submenu-link:hover {
    color: var(--color-orange);
    background: rgba(252, 102, 31, 0.05);
  }

  .submenu-link--active {
    color: var(--color-orange);
    border-bottom-color: var(--color-orange);
  }

  .submenu-mobile-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-slate);
  }

  .submenu-mobile-list {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-bottom: 0.75rem;
  }

  .submenu-mobile-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 0;
    font-weight: 600;
    color: var(--color-slate);
    text-decoration: none;
    border-left: 3px solid transparent;
    padding-left: 0.75rem;
    transition: all 0.2s ease;
  }

  .submenu-mobile-link:hover {
    color: var(--color-orange);
    background: rgba(252, 102, 31, 0.05);
  }

  .submenu-mobile-link--active {
    color: var(--color-orange);
    border-left-color: var(--color-orange);
    background: rgba(252, 102, 31, 0.05);
  }
</style>
