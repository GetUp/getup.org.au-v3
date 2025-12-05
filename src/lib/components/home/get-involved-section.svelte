<script lang="ts">
  let { content = {} as any } = $props();

  const defaultItems = [
    {
      icon: "petition",
      title: "Start a petition",
      description: "Launch your own campaign and rally support for the change you want to see.",
      link: "https://petitions.getup.org.au/petition/start?source=homepage",
      external: true,
    },
    {
      icon: "campaigns",
      title: "Join a campaign",
      description: "Add your voice to campaigns fighting for climate action, fairness, and justice.",
      link: "/campaigns",
      external: false,
    },
    {
      icon: "donate",
      title: "Make a donation",
      description: "Power our campaigns and help build a movement for change.",
      link: "/donate",
      external: false,
    },
  ];

  const items = content.items?.length ? content.items : defaultItems;
  const heading = content.heading || "Get involved";
</script>

<section class="get-involved">
  <div class="get-involved__container">
    <h2 class="get-involved__heading font-header">{heading}</h2>

    <div class="get-involved__grid">
      {#each items as item}
        <a
          href={item.link}
          class="get-involved__card"
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
        >
          <div class="get-involved__icon">
            {#if item.icon === "petition"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else if item.icon === "campaigns"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else if item.icon === "donate"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else if item.icon === "email"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {/if}
          </div>
          <div class="get-involved__content">
            <h3 class="get-involved__title">{item.title}</h3>
            <p class="get-involved__description">{item.description}</p>
          </div>
          <span class="get-involved__arrow">→</span>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  .get-involved {
    background: var(--color-sand, #faf9f7);
    padding: 3rem 1rem;
  }

  @media (min-width: 768px) {
    .get-involved {
      padding: 4rem 1.5rem;
    }
  }

  .get-involved__container {
    max-width: 72rem;
    margin: 0 auto;
  }

  .get-involved__heading {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--color-slate, #1e293b);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  @media (min-width: 768px) {
    .get-involved__heading {
      font-size: 2.25rem;
      margin-bottom: 2rem;
    }
  }

  .get-involved__grid {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .get-involved__grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
  }

  .get-involved__card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }

  .get-involved__card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--color-orange, #f97316);
    transform: translateY(-2px);
  }

  @media (min-width: 640px) {
    .get-involved__card {
      flex-direction: column;
      text-align: center;
      align-items: center;
      padding: 1.5rem;
    }
  }

  .get-involved__icon {
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    background: var(--color-orange, #f97316);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .get-involved__icon svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (min-width: 640px) {
    .get-involved__icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 0.75rem;
    }

    .get-involved__icon svg {
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  .get-involved__content {
    flex: 1;
    min-width: 0;
  }

  .get-involved__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-slate, #1e293b);
    margin: 0 0 0.25rem 0;
  }

  @media (min-width: 640px) {
    .get-involved__title {
      font-size: 1.125rem;
      margin-bottom: 0.5rem;
    }
  }

  .get-involved__description {
    font-size: 0.875rem;
    color: var(--color-slate-light, #64748b);
    margin: 0;
    line-height: 1.5;
  }

  .get-involved__arrow {
    flex-shrink: 0;
    font-size: 1.25rem;
    color: var(--color-orange, #f97316);
    transition: transform 0.2s ease;
  }

  .get-involved__card:hover .get-involved__arrow {
    transform: translateX(4px);
  }

  @media (min-width: 640px) {
    .get-involved__arrow {
      display: none;
    }
  }
</style>
