<script lang="ts">
  import { onMount } from 'svelte';

  type DonationStat = {
    created_at: string;
    id: number;
    name: string;
    day: number;
    month: number;
    week: number;
    year: number;
  };

  let stats: DonationStat[] = [];
  let status: 'loading' | 'success' | 'error' = 'loading';

  onMount(async () => {
    try {
      const res = await fetch('https://www.getup.org.au/api/transparency_stats');
      const json = await res.json();
      stats = json;
      status = 'success';
    } catch (e) {
      status = 'error';
    }
  });

  function formatDate(datestring: string) {
    return datestring.replace(/(.+)T(.{5}).+/, '$1 $2');
  }

  const thousandsSeparator = (data: number) => new Intl.NumberFormat('en-AU').format(data);

  const currency = (data: number) =>
    new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(data);

  const formatter = (stat: DonationStat, val: number) =>
    stat.name === 'Donations Total' || stat.name === 'Average Donations' ? currency(val) : thousandsSeparator(val);
</script>

<section id="in-the-numbers" class="space-y-6">

  {#if status === 'loading'}
    <div class="animate-pulse space-y-2">
      {#each Array(10) as _, i}
        <div class="h-12 w-full bg-gray-200 rounded"></div>
      {/each}
    </div>
  {/if}

  {#if status === 'error'}
    <div class="text-center py-24">Sorry! Something went wrong. Please try again later!</div>
  {/if}

  {#if status === 'success'}
    <div class="rounded-lg shadow overflow-x-auto border border-gray-200">
      <table class="w-full whitespace-nowrap">
        <thead>
          <tr class="text-left font-bold text-sm bg-gray-50 text-gray-700">
            <th class="px-3 md:px-6 py-4"></th>
            <th class="px-3 md:px-6 py-4">Last Day</th>
            <th class="px-3 md:px-6 py-4">Last 7 Days</th>
            <th class="px-3 md:px-6 py-4">Last 30 Days</th>
            <th class="px-3 md:px-6 py-4">Last 365 Days</th>
          </tr>
        </thead>

        <tbody>
          {#each stats as stat (stat.name)}
            <tr class="hover:bg-gray-50 focus-within:bg-gray-50 text-sm md:text-base">
              <td class="border-t border-gray-100 px-3 md:px-6 py-4 bg-gray-50 text-gray-700 font-medium">
                {stat.name}
              </td>
              <td class="border-t border-gray-100 px-3 md:px-6 py-4">{formatter(stat, stat.day)}</td>
              <td class="border-t border-gray-100 px-3 md:px-6 py-4">{formatter(stat, stat.week)}</td>
              <td class="border-t border-gray-100 px-3 md:px-6 py-4">{formatter(stat, stat.month)}</td>
              <td class="border-t border-gray-100 px-3 md:px-6 py-4">{formatter(stat, stat.year)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="text-sm text-gray-600 space-y-2">
      <p>+ Updated once a day. Last updated: {stats.length > 0 ? formatDate(stats[0].created_at) : ''}</p>
      <p>
        ^ For technical reasons not all donations processed through this website are included in these statistics.
        These amounts are subject to change at any time.
      </p>
      <p>
        GetUp has never donated, or received a donation, from any political party – ever. GetUp voluntarily
        discloses above and beyond what is required of political parties. 97% of donations to GetUp are under
        $100. For more information, see our{' '}
        <a href="/about/transparency" class="underline hover:no-underline text-(--color-orange)">transparency information</a>.
      </p>
    </div>
  {/if}
</section>
