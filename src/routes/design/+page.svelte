<script>
  import {
    Petition,
    Donation,
    Volunteer,
    Protest,
    Rally,
    SignUp,
    Share,
    Email,
    Phone,
    Impact,
    Solidarity,
    Campaign,
    Event,
    Signature,
    CreditCard
  } from '$lib/components/icons';
  import Submenu from '$lib/components/submenu.svelte';
  import SidebarSubmenu from '$lib/components/sidebar-submenu.svelte';

  // Example submenu items
  const submenuItems = [
    { label: 'Overview', href: '/campaigns' },
    { label: 'Active Campaigns', href: '/campaigns/active', icon: Campaign },
    { label: 'Take Action', href: '/campaigns/action', icon: Impact },
    { label: 'Success Stories', href: '/campaigns/success', icon: Solidarity },
    { label: 'Get Involved', href: '/campaigns/involved', icon: Volunteer }
  ];

  // Example sidebar items
  const sidebarItems = [
    {
      label: 'Getting Started',
      href: '/docs/getting-started',
      icon: Impact,
      children: [
        { label: 'Installation', href: '/docs/getting-started/installation' },
        { label: 'Quick Start', href: '/docs/getting-started/quick-start' },
        { label: 'Configuration', href: '/docs/getting-started/config' }
      ]
    },
    {
      label: 'Campaigns',
      href: '/docs/campaigns',
      icon: Campaign,
      children: [
        { label: 'Creating Campaigns', href: '/docs/campaigns/creating' },
        { label: 'Managing Actions', href: '/docs/campaigns/actions' },
        { label: 'Tracking Impact', href: '/docs/campaigns/tracking' }
      ]
    },
    {
      label: 'Community',
      href: '/docs/community',
      icon: Rally,
      children: [
        { label: 'Member Engagement', href: '/docs/community/engagement' },
        { label: 'Events', href: '/docs/community/events' }
      ]
    },
    { label: 'Resources', href: '/docs/resources', icon: Solidarity }
  ];
</script>

<svelte:head>
  <title>Design System - GetUp</title>
  <meta name="description" content="GetUp design tokens and components" />
</svelte:head>

<main class="section typography-demo">
  <div class="container space-y-12">
    <section class="space-y-3">
      <p class="text-sm font-semibold uppercase text-gray-500">Design System</p>
      <h1>People. Power. <span class="u-underlined">Impact.</span></h1>
      <p class="max-w-3xl text-lg text-gray-700">
        Core tokens and components inspired by the refreshed GetUp direction: bold typography, unapologetic orange,
        hand-drawn accents used sparingly, and people-first photography.
      </p>
      <div class="flex flex-wrap gap-3 md:hidden">
        <button class="btn btn-primary">Get involved</button>
        <button class="btn btn-ghost">Donate</button>
      </div>
    </section>

    <section class="card">
      <h2 class="mb-4">Brand Colors</h2>
      <p class="text-sm text-gray-600 mb-3">Primaries</p>
      <div class="grid gap-3 md:grid-cols-3 lg:grid-cols-6 mb-6">
        {#each [
          { name: 'Orange', hex: '#FC661F' },
          { name: 'Purple', hex: '#4A47D6' },
          { name: 'Slate', hex: '#26262D' },
          { name: 'Black Slate', hex: '#16161A' },
          { name: 'Sand', hex: '#F1EFE0' },
          { name: 'White', hex: '#FFFFFF', border: true }
        ] as swatch}
          <div class="rounded-lg p-3 border border-gray-100 bg-white shadow-sm">
            <div class="h-16 rounded-md mb-3" style={`background:${swatch.hex};${swatch.border ? 'border:1px solid #e5e7eb;' : ''}`}></div>
            <p class="font-semibold">{swatch.name}</p>
            <p class="text-sm text-gray-600">{swatch.hex}</p>
          </div>
        {/each}
      </div>
      <p class="text-sm text-gray-600 mb-3">Secondaries</p>
      <div class="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {#each [
          { name: 'Brown', hex: '#8B4513' },
          { name: 'Pink', hex: '#EAB3A9' },
          { name: 'Green', hex: '#2EB07C' },
          { name: 'Deep Green', hex: '#0B7A57' },
          { name: 'Yellow', hex: '#F5D000' },
          { name: 'Purple Accent', hex: '#3D3AB8' }
        ] as swatch}
          <div class="rounded-lg p-3 border border-gray-100 bg-white shadow-sm">
            <div class="h-16 rounded-md mb-3" style={`background:${swatch.hex}`}></div>
            <p class="font-semibold">{swatch.name}</p>
            <p class="text-sm text-gray-600">{swatch.hex}</p>
          </div>
        {/each}
      </div>
    </section>

    <section class="card">
      <h2 class="mb-4">Typography & Fonts</h2>
      <div class="space-y-4">
        <div>
          <p class="text-xs uppercase text-gray-500">Display (Anton) — class <code>.font-display</code></p>
          <h3 class="font-subheader">Big & Bold Headings (sample style)</h3>
        </div>
        <div>
          <p class="text-xs uppercase text-gray-500">Body (Manrope) — class <code>.font-body</code></p>
          <p class="text-lg font-body">
            Body copy uses Manrope for clarity and warmth. Use bold sparingly to emphasise action words.
          </p>
        </div>
        <div class="space-y-2">
          <p class="text-xs uppercase text-gray-500">Serif (Adelle) — class <code>.font-serif</code></p>
          <p class="font-serif text-xl leading-tight">
            ‘Quote style if corporations thrive while families sink, the system needs a tune-up.’
          </p>
          <p class="text-sm text-gray-600">
            Loaded from <a class="underline" href="https://gu-static-hosting.s3.ap-southeast-2.amazonaws.com/fonts/getup-2025/adelle.css">adelle.css</a>
            &nbsp;|&nbsp;
            <a class="underline" href="https://gu-static-hosting.s3.ap-southeast-2.amazonaws.com/fonts/getup-2025/adelle.html">specimen</a>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-primary">Primary CTA</button>
          <button class="btn btn-ghost">Ghost CTA</button>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="mb-6">Components</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="bg-[color:var(--color-orange)] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <p class="text-sm uppercase tracking-wide mb-2">Impact Card</p>
          <h3 class="text-3xl leading-tight">People. Power. Impact.</h3>
          <p class="mt-3 text-white/90">
            Loud typography on orange. Use for hero messaging and section intros.
          </p>
          <div class="mt-4 flex gap-3">
            <button class="btn btn-ghost bg-white text-[color:var(--color-orange)] border-transparent hover:translate-y-0">
              Join us
            </button>
            <button class="btn btn-ghost text-white border-white">Donate</button>
          </div>
        </div>

        <div class="rounded-xl border border-gray-100 shadow-sm bg-white p-5 space-y-3">
          <div class="flex items-center gap-3">
            <div class="tag">Campaign</div>
            <span class="text-sm font-semibold text-gray-500">Hand-drawn highlight</span>
          </div>
          <p class="text-xl font-bold">Ban gambling ads now</p>
          <p class="text-gray-700">
            Use hand-drawn arrows or highlights sparingly to guide attention to key stats or CTAs.
          </p>
          <div class="flex gap-3 pt-2">
            <button class="btn btn-primary">Take action</button>
            <button class="btn btn-ghost">Share</button>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="mb-4">Button Types</h2>
      <div class="space-y-6">
        <!-- Button Variants -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Button Variants</p>
          <div class="flex flex-wrap gap-3">
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-ghost">Ghost</button>
            <button class="btn btn-outline">Outline</button>
            <button class="btn btn-text">Text Only</button>
          </div>
        </div>

        <!-- Button Sizes -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Button Sizes</p>
          <div class="flex flex-wrap gap-3 items-center">
            <button class="btn btn-primary btn-sm">Small</button>
            <button class="btn btn-primary btn-md">Medium</button>
            <button class="btn btn-primary btn-lg">Large</button>
            <button class="btn btn-primary btn-xl">Extra Large</button>
          </div>
        </div>

        <!-- Button States -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Button States</p>
          <div class="flex flex-wrap gap-3">
            <button class="btn btn-primary">Normal</button>
            <button class="btn btn-primary" disabled>Disabled</button>
            <button class="btn btn-primary btn-loading">Loading</button>
          </div>
        </div>

        <!-- Full Width -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Full Width Button</p>
          <button class="btn btn-primary btn-block">Full Width Button</button>
        </div>

        <!-- Button Groups -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Button Groups</p>
          <div class="btn-group">
            <button class="btn btn-outline">Left</button>
            <button class="btn btn-outline">Middle</button>
            <button class="btn btn-outline">Right</button>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="mb-4">Navigation Submenu</h2>
      <p class="text-sm text-gray-600 mb-6">Horizontal navigation submenu for section pages with mobile dropdown support.</p>

      <div class="space-y-8">
        <!-- Default Submenu -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Default Submenu</p>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <Submenu items={submenuItems} activeHref="/campaigns/active" />
          </div>
        </div>

        <!-- Without Icons -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Without Icons</p>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <Submenu
              items={[
                { label: 'About Us', href: '/about' },
                { label: 'Our Team', href: '/about/team' },
                { label: 'Values', href: '/about/values' },
                { label: 'Annual Report', href: '/about/report' },
                { label: 'Contact', href: '/about/contact' }
              ]}
              activeHref="/about/team"
            />
          </div>
        </div>

        <!-- Sticky Version -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Sticky Submenu</p>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <Submenu items={submenuItems} activeHref="/campaigns" sticky={true} />
          </div>
          <p class="text-xs text-gray-500 mt-2">Add <code class="bg-gray-100 px-1 py-0.5 rounded">sticky={true}</code> to make the submenu stick to the top on scroll</p>
        </div>

        <!-- Usage Example -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Usage</p>
          <pre class="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto"><code>{`<script>
  import Submenu from '$lib/components/submenu.svelte';
  import { Campaign, Impact, Volunteer } from '$lib/components/icons';

  const items = [
    { label: 'Overview', href: '/campaigns' },
    { label: 'Active', href: '/campaigns/active', icon: Campaign },
    { label: 'Take Action', href: '/campaigns/action', icon: Impact }
  ];
</script>

<Submenu items={items} activeHref="/campaigns/active" sticky={true} />`}</code></pre>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="mb-4">Sidebar Submenu</h2>
      <p class="text-sm text-gray-600 mb-6">Vertical navigation sidebar that floats in the page gutter with nested children support.</p>

      <div class="space-y-8">
        <!-- Live Example -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Live Example (Sticky)</p>
          <div class="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-8">
            <div class="flex gap-8">
              <SidebarSubmenu items={sidebarItems} activeHref="/docs/campaigns/actions" sticky={true} />
              <div class="flex-1 bg-white rounded-lg p-6 min-h-[600px]">
                <h3 class="text-2xl font-bold mb-4">Main Content Area</h3>
                <p class="text-gray-600 mb-4">
                  This simulates a page with sidebar navigation. The sidebar on the left stays sticky as you scroll through long content.
                </p>
                <div class="space-y-4 text-gray-500">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Features</p>
          <ul class="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li><strong>Nested Children:</strong> Support for two-level navigation hierarchy</li>
            <li><strong>Sticky Positioning:</strong> Stays visible while scrolling (set <code class="bg-gray-100 px-1 py-0.5 rounded">sticky={true}</code>)</li>
            <li><strong>Active State:</strong> Highlights current page and parent section</li>
            <li><strong>Icon Support:</strong> Optional icons for top-level items</li>
            <li><strong>Responsive:</strong> Hidden on mobile (&lt;768px), shown on tablet+</li>
            <li><strong>Smooth Scrollbar:</strong> Custom styled scrollbar for long menus</li>
          </ul>
        </div>

        <!-- Without Icons -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Without Icons</p>
          <div class="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-8">
            <SidebarSubmenu
              items={[
                {
                  label: 'Introduction',
                  href: '/guide/intro',
                  children: [
                    { label: 'What is GetUp?', href: '/guide/intro/what' },
                    { label: 'How it Works', href: '/guide/intro/how' }
                  ]
                },
                {
                  label: 'Taking Action',
                  href: '/guide/action',
                  children: [
                    { label: 'Sign Petitions', href: '/guide/action/petitions' },
                    { label: 'Donate', href: '/guide/action/donate' },
                    { label: 'Volunteer', href: '/guide/action/volunteer' }
                  ]
                },
                { label: 'FAQ', href: '/guide/faq' }
              ]}
              activeHref="/guide/action/petitions"
              sticky={false}
            />
          </div>
        </div>

        <!-- Usage Example -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Usage</p>
          <pre class="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto"><code>{`<script>
  import SidebarSubmenu from '$lib/components/sidebar-submenu.svelte';
  import { Campaign, Impact } from '$lib/components/icons';

  const items = [
    {
      label: 'Getting Started',
      href: '/docs/start',
      icon: Impact,
      children: [
        { label: 'Installation', href: '/docs/start/install' },
        { label: 'Quick Start', href: '/docs/start/quick' }
      ]
    },
    { label: 'Campaigns', href: '/docs/campaigns', icon: Campaign }
  ];
</script>

<div class="flex gap-8">
  <SidebarSubmenu items={items} activeHref="/docs/start/install" sticky={true} />
  <main class="flex-1">
    <!-- Your page content -->
  </main>
</div>`}</code></pre>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="mb-4">Action Icons</h2>
      <p class="text-sm text-gray-600 mb-6">Premium single-color icons for activist actions, optimized for campaigns and calls-to-action.</p>

      <div class="space-y-6">
        <!-- Icon Grid - Default Size -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Primary Actions</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Petition class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Petition</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Donation class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Donation</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Volunteer class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Volunteer</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Protest class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Protest</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Rally class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Rally</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <SignUp class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Sign Up</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Signature class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Signature</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <CreditCard class="text-orange-500" size={32} />
              <span class="text-xs font-semibold text-center">Credit Card</span>
            </div>
          </div>
        </div>

        <!-- Secondary Actions -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Secondary Actions</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Share class="text-purple-500" size={32} />
              <span class="text-xs font-semibold text-center">Share</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Email class="text-purple-500" size={32} />
              <span class="text-xs font-semibold text-center">Email</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Phone class="text-purple-500" size={32} />
              <span class="text-xs font-semibold text-center">Phone</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Impact class="text-purple-500" size={32} />
              <span class="text-xs font-semibold text-center">Impact</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Solidarity class="text-purple-500" size={32} />
              <span class="text-xs font-semibold text-center">Solidarity</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Campaign class="text-purple-500" size={32} />
              <span class="text-xs font-semibold text-center">Campaign</span>
            </div>
            <div class="flex flex-col items-center gap-2 p-4 rounded border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Event class="text-purple-500" size={32} />
              <span class="text-xs font-semibold text-center">Event</span>
            </div>
          </div>
        </div>

        <!-- Icon Sizes -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Icon Sizes</p>
          <div class="flex items-end gap-6">
            <div class="flex flex-col items-center gap-2">
              <Impact class="text-slate-700" size={16} />
              <span class="text-xs text-gray-500">16px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Impact class="text-slate-700" size={24} />
              <span class="text-xs text-gray-500">24px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Impact class="text-slate-700" size={32} />
              <span class="text-xs text-gray-500">32px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Impact class="text-slate-700" size={48} />
              <span class="text-xs text-gray-500">48px</span>
            </div>
            <div class="flex flex-col items-center gap-2">
              <Impact class="text-slate-700" size={64} />
              <span class="text-xs text-gray-500">64px</span>
            </div>
          </div>
        </div>

        <!-- With Buttons -->
        <div>
          <p class="text-xs uppercase text-gray-500 mb-3">Icons with Buttons</p>
          <div class="flex flex-wrap gap-3">
            <button class="btn btn-primary">
              <Petition size={20} />
              Sign Petition
            </button>
            <button class="btn btn-secondary">
              <Donation size={20} />
              Donate Now
            </button>
            <button class="btn btn-outline">
              <Share size={20} />
              Share
            </button>
            <button class="btn btn-ghost">
              <Volunteer size={20} />
              Volunteer
            </button>
            <button class="btn btn-primary">
              <Signature size={20} />
              Sign Now
            </button>
            <button class="btn btn-secondary">
              <CreditCard size={20} />
              Contribute
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="mb-4">Utilities</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <p class="text-xs uppercase text-gray-500 mb-2">Color utilities</p>
          <div class="flex flex-wrap gap-2">
            <span class="tag u-bg-orange">.u-bg-orange</span>
            <span class="tag u-bg-slate">.u-bg-slate</span>
            <span class="tag u-bg-slate-light">.u-bg-slate-light</span>
            <span class="tag u-bg-purple">.u-bg-purple</span>
            <span class="tag u-bg-purple-dark">.u-bg-purple-dark</span>
            <span class="tag" style="background: var(--color-sand); color: var(--color-slate);">.u-bg-sand</span>
          </div>
          <p class="mt-3 text-gray-700 text-sm">Apply to backgrounds or text via <code>.u-text-*</code> helpers.</p>
        </div>
        <div class="space-y-2">
          <p class="text-xs uppercase text-gray-500 mb-2">Hand-drawn accents</p>
          <p class="u-highlight">.u-highlight wraps text</p>
          <p class="u-underlined">.u-underline to fake marker underline</p>
          <p class="u-arrow">.u-arrow adds a directional cue</p>
          <p class="u-plus">.u-plus adds an addition sign</p>
            <p class="u-bang">.u-bang adds an GetUp style exlclamation</p>
        </div>
      </div>
    </section>
  </div>
</main>

<style>
  :global(.typography-demo h1) {
    font-size: clamp(2.5rem, 2vw + 1.8rem, 3.75rem);
    line-height: 1.1;
    font-weight: 800;
  }

  :global(.typography-demo h2) {
    font-size: clamp(2rem, 1.6vw + 1.4rem, 3rem);
    line-height: 1.15;
    font-weight: 750;
  }

  :global(.typography-demo h3) {
    font-size: clamp(1.5rem, 1.1vw + 1.1rem, 2.25rem);
    line-height: 1.2;
    font-weight: 700;
  }
</style>
