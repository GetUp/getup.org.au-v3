<script lang="ts">
  import { onMount } from "svelte";
  import data from "../../../content/unsubscribe.json";
  import { renderMarkdown } from "$lib/utils/markdown";

  type Status = "ready" | "loading" | "success" | "throttled" | "error";

  let email = "";
  let token = "";
  let guid = "";
  let mailingId = "";
  let status: Status = "ready";
  let lastSubmittedEmail = "";

  onMount(() => {
    const url = new URL(window.location.href);
    email = url.searchParams.get("email") || "";
    token = url.searchParams.get("t") || "";
    guid = url.searchParams.get("guid") || "";
    mailingId = url.searchParams.get("mailing_id") || "";
  });

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      email: formData.get("email") as string,
      token: formData.get("token") as string,
      guid: formData.get("guid") as string,
      mailing_id: formData.get("mailing_id") as string,
      reason: formData.get("reason") as string,
    };

    status = "loading";
    try {
      const res = await fetch("https://api.gu.tools/subscriptions/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      lastSubmittedEmail = payload.email;
      if (res.ok) {
        status = "success";
      } else if (res.status === 429) {
        status = "throttled";
      } else {
        status = "error";
      }
    } catch (err) {
      console.error("Error unsubscribing", err);
      status = "error";
    }
  }
</script>

<svelte:head>
  <title>Unsubscribe - GetUp</title>
  <meta name="description" content="Manage your GetUp email preferences or unsubscribe." />
</svelte:head>

<section class="v2-basic space-y-8">
  <div class="space-y-2">
    <h1>{data.heading}</h1>
  </div>

  <div>
    {@html renderMarkdown(data.body)}
  </div>

  <form class="space-y-4" on:submit|preventDefault={onSubmit}>
    <div class="space-y-2">
      <label for="email" class="block text-sm font-semibold text-gray-700">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        class="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-(--color-orange)"
        placeholder="you@example.com"
        bind:value={email}
        required
      />
      <input type="hidden" name="token" bind:value={token} />
      <input type="hidden" name="guid" bind:value={guid} />
      <input type="hidden" name="mailing_id" bind:value={mailingId} />
      <input
        type="hidden"
        name="reason"
        value={(token.trim() !== "" || mailingId.trim() !== "") ? "campaign-email" : "website-manual"}
      />
    </div>

    {#if status === "success"}
      <div class="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-800 text-sm">
        All done. If {lastSubmittedEmail || "this address"} was subscribed, it has now been unsubscribed. If you continue
        to receive email after 7 days, please <a class="underline font-semibold" href="/contact-us">get in contact</a>.
      </div>
    {:else if status === "throttled"}
      <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
        That's too many attempts, sorry. Please try again later.
      </div>
    {:else if status === "error"}
      <div class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
        Something went wrong. Please try again.
      </div>
    {/if}

    <button
      type="submit"
      class="btn btn-primary w-full md:w-auto"
      disabled={status === "loading"}
    >
      {#if status === "loading"}
        <span class="animate-spin h-5 w-5 border-2 border-white/60 border-t-white rounded-full"></span>
      {:else}
        Unsubscribe
      {/if}
    </button>
  </form>
</section>
