<script lang="ts">
  import { onMount } from "svelte";
  import contact from "../../../content/contact-us.json";
  import { renderMarkdown } from "$lib/utils/markdown";

  let iframeSrc = "";

  onMount(() => {
    const url = new URL(window.location.href);
    const email = url.searchParams.get("email") || "";
    const subject = url.searchParams.get("subject") || "";
    const name = url.searchParams.get("name") || "";
    const fdUrl = new URL(
      "https://supportcore.freshdesk.com/widgets/feedback_widget/new"
    );
    fdUrl.searchParams.set("widgetType", "embedded");
    fdUrl.searchParams.set("widgetView", "no");
    fdUrl.searchParams.set("formTitle", "");
    fdUrl.searchParams.set("submitTitle", "Submit Message");
    fdUrl.searchParams.set(
      "submitThanks",
      "Thanks for reaching out! We will get to your message as soon as possible."
    );
    fdUrl.searchParams.set("screenshot", "No");
    fdUrl.searchParams.set("searchArea", "no");
    fdUrl.searchParams.set("helpdesk_ticket[requester]", email);
    fdUrl.searchParams.set("helpdesk_ticket[subject]", subject);
    fdUrl.searchParams.set("helpdesk_ticket[custom_field][cf_name_981113]", name);
    iframeSrc = fdUrl.toString();
  });
</script>

<svelte:head>
  <title>{contact.heading}</title>
  <meta name="description" content="Get in touch with the GetUp team." />
</svelte:head>

<section class="v2-basic space-y-10">
  <div class="space-y-2">
    <h1>{contact.heading}</h1>
  </div>
  <div class="prose max-w-none">
    {@html renderMarkdown(contact.body)}
  </div>

  <div class="space-y-4">
    <h2 class="text-2xl font-semibold text-slate-900">Send us a message</h2>
    {#if iframeSrc}
      <div class="border border-gray-200 rounded-lg shadow overflow-hidden">
        <iframe
          src={iframeSrc}
          id="contact-form"
          scrolling="no"
          class="w-full"
          style="border: none; height: 760px;"
        ></iframe>
      </div>
    {:else}
      <div class="h-20 flex items-center justify-center text-gray-500">Loading form…</div>
    {/if}
  </div>
</section>
