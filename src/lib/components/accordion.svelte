<script>
    import { slide } from "svelte/transition";

    let { title, children, open = false } = $props();
    let isOpen = $state(open);

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div class="border-b border-gray-200">
    <button
        class="flex w-full items-center justify-between py-4 text-left focus:outline-none"
        onclick={toggle}
        aria-expanded={isOpen}
    >
        <h2 class="text-lg font-bold text-slate">{title}</h2>
        <svg
            class="h-5 w-5 transform text-gray-400 transition-transform duration-200 {isOpen
                ? 'rotate-180'
                : ''}"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    </button>

    {#if isOpen}
        <div class="pb-4 text-gray-700" transition:slide={{ duration: 200 }}>
            {@render children()}
        </div>
    {/if}
</div>
