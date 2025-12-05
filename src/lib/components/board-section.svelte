<script>
  import { aboutBoard } from "$lib/data/content";

  let { data = aboutBoard || {} } = $props();

  const board = (data.members || [])
    .map((m) => ({
      ...m,
      order: Number(m.order) || 999,
      bodyHtml: (m.body || "")
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p) => `<p>${p.trim()}</p>`)
        .join(""),
    }))
    .sort((a, b) => a.order - b.order);
</script>

<section class="board-section">
  <div class="board-section__container">
    <div class="board-section__grid">
      {#each board as member}
        <article class="board-member">
          <div class="board-member__avatar">
            {#if member.image}
              <img
                src={member.image}
                alt={member.name}
                class="board-member__image"
              />
            {/if}
          </div>
          <div class="board-member__content">
            <header class="board-member__header">
              <h3 class="board-member__name">
                {member.name}
              </h3>
              {#if member.role}
                <p class="board-member__role">
                  {member.role}
                </p>
              {/if}
            </header>
            {#if member.bodyHtml}
              <div class="board-member__bio">
                {@html member.bodyHtml}
              </div>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .board-section {
    background: var(--color-white);
  }

  .board-section__container {
    max-width: 80rem;
    margin: 0 auto;
  }

  .board-section__grid {
    column-count: 1;
    column-gap: var(--space-8);
  }

  @media (min-width: 768px) {
    .board-section__grid {
      column-count: 2;
    }
  }

  .board-member {
    background: var(--color-sand);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-slate-100);
    padding: var(--space-8);
    break-inside: avoid-column;
    margin-bottom: var(--space-8);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    align-items: flex-start;
  }

  @media (min-width: 640px) {
    .board-member {
      flex-direction: row;
    }
  }

  .board-member__avatar {
    flex-shrink: 0;
    width: 128px;
    height: 128px;
    border-radius: var(--radius-full);
    overflow: hidden;
    background: var(--color-slate-200);
    border: 4px solid var(--color-white);
    box-shadow: var(--shadow-sm);
  }

  .board-member__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .board-member__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    flex: 1;
  }

  .board-member__header {
    display: flex;
    flex-direction: column;
  }

  .board-member__name {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: var(--font-normal);
    color: var(--color-slate);
    line-height: var(--leading-tight);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .board-member:hover .board-member__name {
    color: var(--color-orange);
  }

  .board-member__role {
    color: var(--color-orange);
    font-weight: var(--font-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: var(--text-xs);
    margin-top: var(--space-1);
  }

  .board-member__bio {
    font-size: var(--text-sm);
    color: var(--color-slate);
    line-height: var(--leading-relaxed);
  }

  .board-member__bio :global(p) {
    margin-bottom: var(--space-3);
  }

  .board-member__bio :global(p:last-child) {
    margin-bottom: 0;
  }
</style>
