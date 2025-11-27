<script lang="ts">
  import donationsRaw from "../../../content/donations-policy.yaml?raw";
  import { parseYamlBlock, renderMarkdown } from "$lib/utils/markdown";

  const { heading, body } = parseYamlBlock(donationsRaw);
</script>

<svelte:head>
  <title>{heading || "Donations Policy"}</title>
  <meta name="description" content="GetUp donations policy and disclosures." />
</svelte:head>

<section class="v2-basic space-y-6">
  <div class="space-y-2">
    <h1>{heading || "Donations Policy"}</h1>
  </div>
  <div>
    {@html renderMarkdown(body)}
  </div>
</section>
