<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  
  interface Props {
    isOpen?: boolean;
    onClose?: any;
  }

  let { isOpen = false, onClose = () => {} }: Props = $props();
  
  let email = $state('');
  let firstName = $state('');
  let lastName = $state('');
  let postcode = $state('');
  let phone = $state('');
  let interests = $state([]);
  let isSubmitting = $state(false);
  let step = $state(1);
  
  const campaignOptions = [
    { id: 'climate', label: 'Climate Justice' },
    { id: 'first-nations', label: 'First Nations Justice' },
    { id: 'democracy', label: 'Democracy & Accountability' },
    { id: 'economic', label: 'Economic Fairness' },
    { id: 'human-rights', label: 'Human Rights' },
  ];
  
  function toggleInterest(id) {
    if (interests.includes(id)) {
      interests = interests.filter(i => i !== id);
    } else {
      interests = [...interests, id];
    }
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      step = 2;
      return;
    }
    
    isSubmitting = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    isSubmitting = false;
    alert('Welcome to GetUp! Check your email for next steps.');
    onClose();
    email = '';
    firstName = '';
    lastName = '';
    postcode = '';
    phone = '';
    interests = [];
    step = 1;
  }
  
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    transition:fade={{ duration: 200 }}
    onclick={handleBackdropClick}
    onkeydown={handleKeyDown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
  >
    <div 
      class="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      transition:fly={{ y: 50, duration: 300 }}
    >
      <div class="bg-orange p-6 relative">
        <button 
          onclick={onClose}
          class="absolute top-4 right-4 text-white/80 hover:text-white"
          aria-label="Close modal"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 id="modal-title" class="font-subheader text-3xl text-white">
          GET INVOLVED
        </h2>
        <p class="text-white/90 mt-2">
          Join over a million Australians making change happen.
        </p>
        
        <div class="flex gap-2 mt-4">
          <div class="h-1 flex-1 rounded-full {step >= 1 ? 'bg-white' : 'bg-white/30'}"></div>
          <div class="h-1 flex-1 rounded-full {step >= 2 ? 'bg-white' : 'bg-white/30'}"></div>
        </div>
      </div>
      
      <form onsubmit={handleSubmit} class="p-6">
        {#if step === 1}
          <div class="space-y-4" transition:fade>
            <div>
              <label for="email" class="block text-sm font-bold text-slate mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-bold text-slate mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  bind:value={firstName}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-bold text-slate mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  bind:value={lastName}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="postcode" class="block text-sm font-bold text-slate mb-1">
                  Postcode *
                </label>
                <input
                  type="text"
                  id="postcode"
                  bind:value={postcode}
                  required
                  maxlength="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                />
              </div>
              <div>
                <label for="phone" class="block text-sm font-bold text-slate mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  bind:value={phone}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
                />
              </div>
            </div>
          </div>
        {:else}
          <div class="space-y-4" transition:fade>
            <p class="text-slate font-medium">What campaigns interest you most?</p>
            <div class="space-y-2">
              {#each campaignOptions as option}
                <button
                  type="button"
                  onclick={() => toggleInterest(option.id)}
                  class="w-full flex items-center gap-3 p-3 border rounded-lg transition-colors {interests.includes(option.id) ? 'border-orange bg-orange/10' : 'border-gray-200 hover:border-gray-300'}"
                >
                  <div class="w-5 h-5 rounded border-2 flex items-center justify-center {interests.includes(option.id) ? 'border-orange bg-orange' : 'border-gray-300'}">
                    {#if interests.includes(option.id)}
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    {/if}
                  </div>
                  <span class="text-slate">{option.label}</span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="mt-6 flex gap-3">
          {#if step === 2}
            <button
              type="button"
              onclick={() => step = 1}
              class="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-slate hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          {/if}
          <button
            type="submit"
            disabled={isSubmitting}
            class="flex-1 py-3 bg-orange text-white rounded-lg font-bold hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </span>
            {:else}
              {step === 1 ? 'Continue' : 'Join GetUp'}
            {/if}
          </button>
        </div>
        
        <p class="mt-4 text-xs text-gray-500 text-center">
          By signing up, you agree to our privacy policy and to receive campaign updates via email.
        </p>
      </form>
    </div>
  </div>
{/if}
