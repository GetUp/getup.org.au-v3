<script>
  import { onMount, tick } from "svelte";

  // Props
  export let title = "";
  export let submitLabel = "Submit Message";
  export let submitThanks =
    "Thanks for reaching out! We will get to your message as soon as possible.";
  export let height = "736px";

  let iframeElement;
  let iframeSrc = "";

  onMount(async () => {
    const url = new URL(window.location.href);
    const email = url.searchParams.get("email") || "";
    const subject = url.searchParams.get("subject") || "";
    const name = url.searchParams.get("name") || "";

    // Base URL
    const fdUrl = new URL(
      "https://supportcore.freshdesk.com/widgets/feedback_widget/new"
    );

    // Config params
    fdUrl.searchParams.set("widgetType", "embedded");
    fdUrl.searchParams.set("widgetView", "no");
    fdUrl.searchParams.set("screenshot", "No");
    fdUrl.searchParams.set("searchArea", "no");

    // Dynamic content
    if (title) fdUrl.searchParams.set("formTitle", title);
    fdUrl.searchParams.set("submitTitle", submitLabel);
    fdUrl.searchParams.set("submitThanks", submitThanks);

    // Prefill params (Freshdesk specific)
    if (email) fdUrl.searchParams.set("helpdesk_ticket[requester]", email);
    if (subject) fdUrl.searchParams.set("helpdesk_ticket[subject]", subject);
    if (name)
      fdUrl.searchParams.set(
        "helpdesk_ticket[custom_field][cf_name_981113]",
        name
      );

    iframeSrc = fdUrl.toString();

    // Wait for DOM update so iframeElement is bound
    await tick();

    // Initialize iframe-resizer
    if (iframeElement) {
      try {
        const iframeResizeModule = await import("@iframe-resizer/parent");
        const iframeResize = iframeResizeModule.default;
        if (iframeResize) {
          // Initialize with specific options or defaults
          // 'heightCalculationMethod' might vary depending on Freshdesk's implementation if they support it
          iframeResize({ license: "GPLv3", checkOrigin: false }, iframeElement);
        }
      } catch (error) {
        console.warn(
          "Failed to initialize iframe-resizer for Freshdesk:",
          error
        );
      }
    }
  });
</script>

<div id="contact-form" class="w-full flex justify-center">
  {#if iframeSrc}
    <iframe
      bind:this={iframeElement}
      src={iframeSrc}
      title="Contact Form"
      id="iframe_fd"
      scrolling="no"
      style="border: none; width: 100%; max-width: 600px; min-height: {height};"
    ></iframe>
  {:else}
    <div class="p-8 text-center text-gray-500">Loading form...</div>
  {/if}
</div>
