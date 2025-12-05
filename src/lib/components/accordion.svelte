<script>
    import { slide } from "svelte/transition";

    let { title, children, open = false } = $props();
    let isOpen = $state(open);

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div class="accordion">
    <button
        class="accordion__header"
        onclick={toggle}
        aria-expanded={isOpen}
    >
        <span class="accordion__title">{title}</span>
        <svg
            class="accordion__icon {isOpen ? 'accordion__icon--open' : ''}"
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
        <div class="accordion__content" transition:slide={{ duration: 200 }}>
            {@render children()}
        </div>
    {/if}
</div>

<style>
    .accordion {
        border: 1px solid var(--color-slate-200);
        border-radius: var(--radius-lg);
        background: var(--color-white);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
    }

    .accordion__header {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-3) var(--space-4);
        text-align: left;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: background-color var(--duration-fast) var(--ease-out);
    }

    .accordion__header:hover {
        background: var(--color-slate-50);
    }

    .accordion__header:focus {
        outline: none;
    }

    .accordion__title {
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        color: var(--color-slate);
    }

    .accordion__icon {
        width: 20px;
        height: 20px;
        color: var(--color-slate-400);
        transition: transform var(--duration-fast) var(--ease-out);
    }

    .accordion__icon--open {
        transform: rotate(180deg);
    }

    .accordion__content {
        padding: var(--space-4);
        color: var(--color-slate);
        border-top: 1px solid var(--color-slate-200);
    }
</style>
