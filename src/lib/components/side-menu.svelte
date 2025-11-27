<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import Logo from './logo.svelte';
  
  interface Props {
    isOpen?: boolean;
    onClose?: any;
    onOpenSignup?: any;
  }

  let { isOpen = false, onClose = () => {}, onOpenSignup = () => {} }: Props = $props();
  
  let campaignsOpen = $state(false);
  let aboutOpen = $state(false);
  
  const campaigns = [
    { name: 'Climate Justice', icon: 'sun', href: '#climate', color: 'bg-green' },
    { name: 'First Nations Justice', icon: 'heart', href: '#first-nations', color: 'bg-brown' },
    { name: 'Democracy & Accountability', icon: 'vote', href: '#democracy', color: 'bg-purple' },
    { name: 'Economic Fairness', icon: 'scale', href: '#economic', color: 'bg-yellow' },
    { name: 'Human Rights', icon: 'users', href: '#human-rights', color: 'bg-orange' },
  ];
  
  const aboutLinks = [
    { name: 'Our Story', href: '#about' },
    { name: 'Our Board', href: '#board' },
    { name: 'Fundraising Transparency', href: '#transparency' },
    { name: 'Annual Reports', href: '#reports' },
  ];
  
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  
  function handleBackdropKeydown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 z-40 bg-black/50"
    transition:fade={{ duration: 200 }}
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="button"
    tabindex="-1"
    aria-label="Close menu"
  ></div>
  
  <aside 
    class="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full bg-white shadow-2xl overflow-y-auto"
    transition:slide={{ duration: 300, axis: 'x' }}
  >
    <div class="p-4 border-b border-gray-100 flex items-center justify-between">
      <Logo class="h-8 w-auto" />
      <button 
        onclick={onClose}
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Close menu"
      >
        <svg class="w-6 h-6 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <nav class="p-4">
      <div class="border-b border-gray-100">
        <button 
          class="flex items-center justify-between w-full py-4 text-left"
          onclick={() => campaignsOpen = !campaignsOpen}
        >
          <span class="font-bold text-slate text-lg">Campaigns</span>
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform {campaignsOpen ? 'rotate-180' : ''}" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {#if campaignsOpen}
          <div class="pb-4 space-y-1" transition:slide={{ duration: 200 }}>
            {#each campaigns as campaign}
              <a 
                href={campaign.href}
                onclick={() => { onClose(); }}
                class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sand transition-colors"
              >
                <div class="{campaign.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm">
                  {#if campaign.icon === 'sun'}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  {:else if campaign.icon === 'heart'}
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21H7a2 2 0 00-2 2v-12a2 2 0 002-2h10a2 2 0 002 2v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  {:else if campaign.icon === 'vote'}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  {:else if campaign.icon === 'scale'}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  {:else}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  {/if}
                </div>
                <span class="text-slate">{campaign.name}</span>
              </a>
            {/each}
          </div>
        {/if}
      </div>
      
      <div class="border-b border-gray-100">
        <button 
          class="flex items-center justify-between w-full py-4 text-left"
          onclick={() => aboutOpen = !aboutOpen}
        >
          <span class="font-bold text-slate text-lg">About</span>
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform {aboutOpen ? 'rotate-180' : ''}" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {#if aboutOpen}
          <div class="pb-4 space-y-1" transition:slide={{ duration: 200 }}>
            {#each aboutLinks as link}
              <a 
                href={link.href}
                onclick={() => { onClose(); }}
                class="block px-3 py-2 rounded-lg hover:bg-sand transition-colors text-slate"
              >
                {link.name}
              </a>
            {/each}
          </div>
        {/if}
      </div>
      
      <a 
        href="#reports"
        onclick={() => { onClose(); }}
        class="block py-4 border-b border-gray-100 font-bold text-slate text-lg hover:text-orange transition-colors"
      >
        Reports
      </a>
      
      <a 
        href="#donate"
        onclick={() => { onClose(); }}
        class="block py-4 border-b border-gray-100 font-bold text-slate text-lg hover:text-orange transition-colors"
      >
        Donate
      </a>
    </nav>
    
    <div class="p-4">
      <button 
        onclick={() => { onOpenSignup(); onClose(); }}
        class="w-full bg-orange text-white font-bold py-4 rounded-lg hover:bg-orange-dark transition-colors"
      >
        GET INVOLVED!
      </button>
    </div>
  </aside>
{/if}
