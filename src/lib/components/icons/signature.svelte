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
  <path d="M3 17c3.333-3.333 5-4.167 5-5s-1-2-2-2-3 1-4 2" />
  <path d="M12 14c1.667-2 3-3 4-3 .833 0 1.333.667 1 2-.333 1.333-1.333 3-3 5" />
  <path d="m17 15 4-4" />
  <path d="m18 10 4-4" />
</svg>
