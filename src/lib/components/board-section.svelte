<script>
  // Load board markdown files from content/_board (same shape as v2)
  const boardFiles = import.meta.glob('../../../content/_board/*.md', { as: 'raw', eager: true });

  /** @param {string} raw */
  const parseFrontmatter = (raw) => {
    const parts = raw.split('---');
    if (parts.length < 3) return { data: {}, body: raw };
    const front = parts[1].trim().split('\n');
    /** @type {Record<string, string>} */
    const data = {};
    front.forEach((line) => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        data[key] = value;
      }
    });
    return { data, body: parts.slice(2).join('---').trim() };
  };

  const formatBody = (body = '') =>
    body
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((p) => `<p>${p.trim()}</p>`)
      .join('');

  const board = Object.values(boardFiles)
    .map((raw) => parseFrontmatter(raw))
    .map(({ data, body }) => ({
      name: data.name,
      role: data.role,
      image: data.image,
      order: Number(data.order) || 999,
      bodyHtml: formatBody(body)
    }))
    .sort((a, b) => a.order - b.order);
</script>

<section class="py-12 px-4 bg-white">
  <div class="max-w-7xl mx-auto">
    <div class="space-y-4 md:columns-2 md:gap-6">
      {#each board as member}
        <article class="bg-sand rounded-lg shadow-sm border border-gray-100 p-5 space-y-3 break-inside-avoid-column">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {#if member.image}
                <img src={member.image} alt={member.name} class="w-full h-full object-cover" />
              {/if}
            </div>
            <div class="space-y-1">
              <p class="font-bold text-lg text-slate leading-tight">{member.name}</p>
              {#if member.role}<p class="text-sm text-gray-600">{member.role}</p>{/if}
            </div>
          </div>
          {#if member.bodyHtml}
            <div class="prose prose-sm text-gray-700 max-w-none">
              {@html member.bodyHtml}
            </div>
          {/if}
        </article>
      {/each}
    </div>
  </div>
</section>
