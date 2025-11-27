<script lang="ts">
  import transparency from "../../../../content/transparency.json";

  const body: string = transparency.body || "";

  function extractList(heading: string) {
    const regex = new RegExp(`${heading}\\n\\n([\\s\\S]*?)(\\n\\n|$)`, "i");
    const match = body.match(regex);
    if (!match) return [];
    const block = match[1];
    return block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("* ["))
      .map((line) => {
        const textMatch = line.match(/\[(.+?)\]/);
        const linkMatch = line.match(/\((https?:[^)]+)\)/);
        return {
          label: textMatch ? textMatch[1] : line.replace("*", "").trim(),
          href: linkMatch ? linkMatch[1] : "#",
        };
      });
  }

  const impactReports = extractList("## Annual Reports");
  const financialReports = extractList("## Financial Reports");
  const electionReports = extractList("## Election Reports");
</script>

<svelte:head>
  <title>Impact & Financial Reports - GetUp</title>
  <meta
    name="description"
    content="Browse GetUp's impact reports and audited financial statements."
  />
</svelte:head>

<section class="relative overflow-hidden bg-slate-900 text-white">
  <div
    class="absolute inset-0 opacity-60"
    style="background-image: url('https://gu-static-hosting.s3.ap-southeast-2.amazonaws.com/gu24-refresh/reference_images/grandmother-with-granddaughter-rally.png'); background-size: cover; background-position: center;"
  ></div>
  <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/45 to-black/60"></div>
  <div class="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
    <h1 class="text-4xl md:text-5xl font-display leading-tight">Impact & Audited Financial Reports</h1>
    <p class="text-lg md:text-xl max-w-3xl mt-4">
      Our impact reports and independently audited financial statements, in one place.
    </p>
  </div>
</section>

<section class="space-y-8 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
  <div class="space-y-6">
    <div class="card space-y-4 border border-gray-200 rounded-lg shadow-none">
      <div>
        <h2 class="text-2xl font-bold">Annual impact snapshots</h2>
        <p class="text-gray-700">
          Highlights and outcomes from the past years of people-powered campaigning.
        </p>
      </div>
      <ul class="space-y-2">
        {#each impactReports as report}
          <li>
            <a class="text-(--color-purple) font-semibold hover:underline" href={report.href}>
              {report.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <div class="card space-y-4 border border-gray-200 rounded-lg shadow-none">
      <div>
        <h2 class="text-2xl font-bold">Audited financials</h2>
        <p class="text-gray-700">
          Independently audited statements and disclosures.
        </p>
      </div>
      <ul class="space-y-2">
        {#each financialReports as report}
          <li>
            <a class="text-(--color-purple) font-semibold hover:underline" href={report.href}>
              {report.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <div class="card space-y-4 border border-gray-200 rounded-lg shadow-none">
      <div>
        <h2 class="text-2xl font-bold">Election reviews & submissions</h2>
        <p class="text-gray-700">
          Post-election analyses and formal submissions about our election engagement.
        </p>
      </div>
      <ul class="space-y-2">
        {#each electionReports as report}
          <li>
            <a class="text-(--color-purple) font-semibold hover:underline" href={report.href}>
              {report.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
