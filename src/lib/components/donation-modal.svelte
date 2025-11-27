<script>
  import DonationForm from './donation-form.svelte';
  
  let { isOpen = false, onClose = () => {} } = $props();
  
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="donation-modal-title"
    tabindex="0"
    onkeydown={handleKeydown}
  >
    <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
      <button 
        onclick={onClose}
        class="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Close donation modal"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div id="donation-modal-title" class="sr-only">Donation Form</div>
      
      <DonationForm {onClose} />
    </div>
  </div>
{/if}
