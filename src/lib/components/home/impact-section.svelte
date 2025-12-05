<script>
  import { onMount } from "svelte";

  let { data } = $props();

  const heading = data.heading || "Our impact";
  const body = data.body || "";
  const impactStats = data.impactStats || { heading: "", stats: [], period: "month" };

  let stats = $state([]);
  let loading = $state(true);
  let lastUpdated = $state("");

  onMount(async () => {
    try {
      const res = await fetch("https://www.getup.org.au/api/transparency_stats");
      const json = await res.json();
      stats = json;
      if (json[0]?.created_at) {
        lastUpdated = new Date(json[0].created_at).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
      loading = false;
    } catch (e) {
      console.error("Failed to fetch stats", e);
      loading = false;
    }
  });

  const currency = (val) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const number = (val) => new Intl.NumberFormat("en-AU").format(val);

  const statNameMap = {
    Donations: "Donations",
    "Donations Total": "Donations Total",
    "Average Donation": "Average Donations",
    "Actions Taken": "Actions Taken",
    "New Members": "New Members",
    Donors: "Donors",
    "First-time Donors": "First-time Donors",
  };

  const displayStats = $derived(
    impactStats.stats.map((stat) => {
      const period = impactStats.period || "month";
      const apiName = statNameMap[stat.label] || stat.label;
      const apiData = stats.find((s) => s.name === apiName);
      let dynamicValue = apiData ? apiData[period] : 0;

      if (["Average Donation", "Donations", "Donations Total"].includes(stat.label)) {
        dynamicValue = currency(dynamicValue || 0);
      } else {
        dynamicValue = number(dynamicValue || 0);
      }

      return { ...stat, value: loading ? "..." : dynamicValue };
    })
  );

  const periodLabel = impactStats.period === "week" ? "this week" : impactStats.period === "year" ? "this year" : "this month";
</script>

<section class="impact">
  <div class="impact__container">
    <div class="impact__header">
      <h2 class="impact__heading font-header">{heading}</h2>
      {#if body}
        <p class="impact__body">{body}</p>
      {/if}
    </div>

    <div class="impact__stats">
      <p class="impact__period">Impact {periodLabel}</p>
      <div class="impact__grid">
        {#each displayStats as stat}
          <div class="impact__stat">
            <span class="impact__value">{stat.value}</span>
            <span class="impact__label">{stat.label}</span>
          </div>
        {/each}
      </div>
      {#if lastUpdated}
        <p class="impact__updated">Last updated {lastUpdated}</p>
      {/if}
    </div>
  </div>
</section>

<style>
  .impact {
    background: var(--color-slate, #1e293b);
    padding: 3rem 1rem;
  }

  @media (min-width: 768px) {
    .impact {
      padding: 4rem 1.5rem;
    }
  }

  .impact__container {
    max-width: 72rem;
    margin: 0 auto;
  }

  .impact__header {
    text-align: center;
    margin-bottom: 2rem;
    max-width: 48rem;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 768px) {
    .impact__header {
      margin-bottom: 2.5rem;
    }
  }

  .impact__heading {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    margin: 0 0 0.75rem 0;
  }

  @media (min-width: 768px) {
    .impact__heading {
      font-size: 2.5rem;
    }
  }

  .impact__body {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.6;
  }

  @media (min-width: 768px) {
    .impact__body {
      font-size: 1.125rem;
    }
  }

  .impact__stats {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
  }

  @media (min-width: 768px) {
    .impact__stats {
      padding: 2rem;
    }
  }

  .impact__period {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-orange, #f97316);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 1.5rem 0;
  }

  .impact__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .impact__grid {
      gap: 2rem;
    }
  }

  .impact__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  @media (min-width: 768px) {
    .impact__stat {
      gap: 0.5rem;
    }
  }

  .impact__value {
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
    font-family: var(--font-header);
    line-height: 1;
  }

  @media (min-width: 640px) {
    .impact__value {
      font-size: 2rem;
    }
  }

  @media (min-width: 768px) {
    .impact__value {
      font-size: 2.5rem;
    }
  }

  @media (min-width: 1024px) {
    .impact__value {
      font-size: 3rem;
    }
  }

  .impact__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (min-width: 768px) {
    .impact__label {
      font-size: 0.875rem;
    }
  }

  .impact__updated {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 1.5rem 0 0 0;
  }
</style>
