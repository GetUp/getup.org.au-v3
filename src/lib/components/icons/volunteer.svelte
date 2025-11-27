<script>
  let { class: className = '', size = 24 } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
  <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c.6 0 1.1-.2 1.4-.6l5.6-5.6c.4-.4.6-.9.6-1.4v-2l-2 2" />
  <path d="M2 13l5-5" />
  <path d="M18 20c.6.5 1.4 1 2 1 2 0 2-2 0-2-1.4 0-2.5-.5-3.5-1.5L15 16" />
  <path d="M21 11V6" />
  <path d="M21 3h-6" />
</svg>
