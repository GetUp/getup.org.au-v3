<script lang="ts">
  const faqFiles = import.meta.glob("../../../../content/_faqs/*.md", { as: "raw", eager: true });

  const parseFrontmatter = (raw: string) => {
    const parts = raw.split("---");
    if (parts.length < 3) return { title: "", section: "", content: raw, order: 999 };
    const front = parts[1].trim().split("\n");
    const data: Record<string, string> = {};
    front.forEach((line) => {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        data[key] = value;
      }
    });
    const body = parts.slice(2).join("---").trim();
    return {
      title: data.title || "",
      section: data.section || "General",
      content: body,
      order: Number(data.order) || 999,
    };
  };

  const renderMarkdown = (md: string) =>
    md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n+/g, "</p><p>");

  const faqs = Object.values(faqFiles)
    .map((raw) => parseFrontmatter(raw as string))
    .sort((a, b) => a.order - b.order);

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    acc[faq.section] = acc[faq.section] || [];
    acc[faq.section].push(faq);
    return acc;
  }, {});
</script>

<svelte:head>
  <title>Frequently Asked Questions - GetUp</title>
  <meta name="description" content="Answers to common questions about GetUp, donations, and getting involved." />
</svelte:head>

<section class="space-y-8">
  <div class="space-y-2">
    <h1 class="text-4xl font-display leading-tight">Frequently Asked Questions</h1>
    <p class="text-gray-700">Find answers about GetUp, donations, subscriptions, and getting involved.</p>
  </div>

  <div class="space-y-6">
    {#each Object.keys(grouped) as section}
      <div class="space-y-3">
        <h2 class="text-2xl font-bold text-slate-900">{section}</h2>
        <div class="space-y-4">
          {#each grouped[section] as faq}
            <details class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <summary class="font-semibold text-lg text-slate-900 cursor-pointer">{faq.title}</summary>
              <div class="mt-3 prose max-w-none">
                {@html `<p>${renderMarkdown(faq.content)}</p>`}
              </div>
            </details>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>
