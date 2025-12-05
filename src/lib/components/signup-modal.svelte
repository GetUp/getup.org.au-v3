<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';

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
  let isSubmitting = $state(false);
  let step = $state(1);
  let errorMessage = $state('');

  const FormStatus = {
    READY: 'ready',
    LOADING: 'loading',
    SUCCESS: 'success',
    THROTTLED: 'throttled',
    ERROR: 'error',
  };

  let formStatus = $state(FormStatus.READY);

  async function submitToAPI(isUpdate = false) {
    if (formStatus === FormStatus.LOADING) return;

    formStatus = FormStatus.LOADING;
    errorMessage = '';
    isSubmitting = true;

    try {
      const response = await fetch('https://api.gu.tools/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          post_code: postcode || undefined,
          phone: phone || undefined,
          reason: 'website-signup-modal',
          token: '',
        }),
      });

      if (response.status === 200) {
        // Track success
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'subscribe',
            result: 'success',
            isUpdate: isUpdate
          });
        }
        formStatus = FormStatus.SUCCESS;
        isSubmitting = false;
        return true;
      } else if (response.status === 429) {
        // Rate limited
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({ event: 'subscribe', result: 'throttled' });
        }
        formStatus = FormStatus.THROTTLED;
        errorMessage = "Too many requests. Please try again later.";
        isSubmitting = false;
        return false;
      } else {
        throw new Error(`Subscription failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'subscribe',
          result: 'error',
          error: error.message
        });
      }
      formStatus = FormStatus.ERROR;
      errorMessage = "Something went wrong. Please try again.";
      isSubmitting = false;
      return false;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (step === 1) {
      // Submit email first
      const success = await submitToAPI(false);
      if (success) {
        step = 2;
      }
      return;
    }

    // Step 2: Submit additional details and redirect
    await completeSignup();
  }

  async function completeSignup() {
    if (formStatus === FormStatus.LOADING) return;

    // Submit updated information
    const success = await submitToAPI(true);

    if (success) {
      resetAndClose();
      // Redirect after brief delay
      setTimeout(() => {
        goto('/welcome');
      }, 100);
    }
  }

  function skipDetails() {
    resetAndClose();
    // Just redirect, email already submitted
    goto('/welcome');
  }

  function resetAndClose() {
    onClose();
    // Reset form after modal closes
    setTimeout(() => {
      email = '';
      firstName = '';
      lastName = '';
      postcode = '';
      phone = '';
      step = 1;
      formStatus = FormStatus.READY;
      errorMessage = '';
      isSubmitting = false;
    }, 300);
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      resetAndClose();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      resetAndClose();
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
            <p class="text-slate font-medium mb-4">
              Enter your email to join GetUp
            </p>

            <div>
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                disabled={isSubmitting}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="Email"
              />
            </div>

            {#if errorMessage}
              <div class="text-sm text-red-600 text-center">
                {errorMessage}
              </div>
            {/if}
          </div>
        {:else}
          <div class="space-y-4" transition:fade>
            <p class="text-slate font-medium mb-4">
              Help us personalize your GetUp experience (optional)
            </p>

            <div>
              <input
                type="text"
                id="firstName"
                bind:value={firstName}
                disabled={isSubmitting}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="First name"
              />
            </div>

            <div>
              <input
                type="text"
                id="lastName"
                bind:value={lastName}
                disabled={isSubmitting}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="Last name"
              />
            </div>

            <div>
              <input
                type="text"
                id="postcode"
                bind:value={postcode}
                maxlength="4"
                disabled={isSubmitting}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="Postcode"
              />
            </div>

            <div>
              <input
                type="tel"
                id="phone"
                bind:value={phone}
                disabled={isSubmitting}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                placeholder="Phone number"
              />
            </div>

            {#if errorMessage}
              <div class="text-sm text-red-600 text-center">
                {errorMessage}
              </div>
            {/if}
          </div>
        {/if}

        <div class="mt-6 flex gap-3">
          {#if step === 2}
            <button
              type="button"
              onclick={skipDetails}
              disabled={isSubmitting}
              class="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-slate hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              class="flex-1 py-3 bg-purple text-white rounded-lg font-bold hover:bg-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isSubmitting}
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              {:else}
                Complete
              {/if}
            </button>
          {:else}
            <button
              type="submit"
              disabled={isSubmitting}
              class="flex-1 py-3 bg-purple text-white rounded-lg font-bold hover:bg-purple-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                Continue
              {/if}
            </button>
          {/if}
        </div>

        <p class="mt-4 text-xs text-gray-500 text-center">
          By signing up, you agree to our privacy policy and to receive campaign updates via email.
        </p>
      </form>
    </div>
  </div>
{/if}
