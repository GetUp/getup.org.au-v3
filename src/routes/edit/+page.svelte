<script>
  // @ts-nocheck
  import { onMount } from "svelte";

  let cmsLoaded = $state(false);
  let cmsChoice = $state("sveltia");

  const sveltiaBundle = "https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js";
  const decapBundle = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
  const configPath =
    typeof window !== "undefined"
      ? `${window.location.origin}/config.yml`
      : "/config.yml";

  const registerCustomComponents = () => {
    if (!window.CMS) return;

    window.CMS.registerEditorComponent({
      id: "accordion_section",
      label: "Accordion / Expandable Section",
      fields: [
        { name: "title", label: "Title", widget: "string" },
        { name: "body", label: "Content", widget: "markdown" },
      ],
      pattern:
        /^<details class="group cms-accordion">\n<summary>(.*?)<\/summary>\n<div class="cms-accordion-content">\n([\s\S]*?)\n<\/div>\n<\/details>$/,
      fromBlock: function (match) {
        return {
          title: match[1],
          body: match[2],
        };
      },
      toBlock: function (obj) {
        return `<details class="group cms-accordion">\n<summary>${obj.title}</summary>\n<div class="cms-accordion-content">\n${obj.body}\n</div>\n</details>`;
      },
      toPreview: function (obj) {
        return `<details open style="border: 1px solid #ddd; padding: 1em; margin: 1em 0;">
          <summary style="font-weight: bold; cursor: pointer;">${obj.title}</summary>
          <div style="margin-top: 1em;">${obj.body}</div>
        </details>`;
      },
    });

    window.CMS.registerEditorComponent({
      id: "freshdesk_contact_form",
      label: "Freshdesk Contact Form",
      fields: [
        {
          name: "title",
          label: "Form Title",
          widget: "string",
          required: false,
          hint: "Optional title displayed above the form fields inside the embed.",
        },
        {
          name: "submit_label",
          label: "Submit Button Label",
          widget: "string",
          default: "Submit Message",
        },
        {
          name: "submit_thanks",
          label: "Thanks Message",
          widget: "string",
          default:
            "Thanks for reaching out! We will get to your message as soon as possible.",
        },
        {
          name: "height",
          label: "Height",
          widget: "string",
          default: "736px",
          hint: "CSS height string (e.g. 736px).",
        },
      ],
      pattern: /^@\[freshdesk:(.*?)\]$/,
      fromBlock: function (match) {
        try {
          return JSON.parse(match[1]);
        } catch (e) {
          return {
            title: "",
            submit_label: "Submit Message",
            submit_thanks: "Thanks for reaching out!",
          };
        }
      },
      toBlock: function (obj) {
        const config = {
          title: obj.title || "",
          submit_label: obj.submit_label || "Submit Message",
          submit_thanks: obj.submit_thanks || "Thanks for reaching out!",
          height: obj.height || "736px",
        };
        return `@[freshdesk:${JSON.stringify(config)}]`;
      },
      toPreview: function (obj) {
        return `<div style="background: #f0fdf4; border: 1px solid #22c55e; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem;">
          <h3 style="margin: 0 0 0.5rem 0; color: #15803d; font-family: sans-serif;">Freshdesk Contact Form</h3>
          <ul style="margin: 0; padding-left: 1.25rem; color: #333; font-family: sans-serif; font-size: 0.9rem;">
            <li><strong>Title:</strong> ${obj.title || "(None)"}</li>
            <li><strong>Submit Label:</strong> ${obj.submit_label}</li>
          </ul>
        </div>`;
      },
    });
  };

  const initCms = () => {
    registerCustomComponents();
    // Prefer the Sveltia helper if it exists; fall back to the Decap-compatible API.
    if (typeof window.initCMS === "function") {
      window.initCMS();
    } else if (window.CMS?.init) {
      window.CMS.init();
    }
  };

  onMount(() => {
    // Read choice from query (?cms=decap|sveltia) or localStorage
    const searchParams = new URLSearchParams(window.location.search);
    const stored = localStorage.getItem("cms-choice");
    cmsChoice =
      (searchParams.get("cms") ?? stored ?? "sveltia").toLowerCase() === "decap"
        ? "decap"
        : "sveltia";
    localStorage.setItem("cms-choice", cmsChoice);

    // Ensure manual init so Decap doesn't auto-mount with a missing default config
    window.CMS_MANUAL_INIT = true;

    // Point Decap at the local config file
    const configLink = document.createElement("link");
    configLink.rel = "cms-config-url";
    configLink.type = "text/yaml";
    configLink.href = configPath;
    document.head.appendChild(configLink);

    // Quick sanity check: make sure the config is reachable and looks like YAML/JSON/TOML.
    fetch(configPath)
      .then(async (res) => {
        if (!res.ok) {
          console.error(
            "CMS config fetch failed",
            res.status,
            await res.text()
          );
          return;
        }
        const snippet = (await res.text()).slice(0, 200);
        console.info("CMS config loaded (first 200 chars):", snippet);
      })
      .catch((err) => {
        console.error("CMS config fetch error", err);
      });

    const script = document.createElement("script");
    script.src = cmsChoice === "decap" ? decapBundle : sveltiaBundle;
    script.onload = () => {
      initCms();
      cmsLoaded = true;
    };
    script.onerror = () => {
      cmsLoaded = true;
      // Surface errors in the console so failed loads are visible in dev tools.
      console.error("Failed to load CMS bundle", script.src);
    };
    document.head.appendChild(script);
  });

  const switchCms = (choice) => {
    const url = new URL(window.location.href);
    url.searchParams.set("cms", choice);
    localStorage.setItem("cms-choice", choice);
    window.location.href = url.toString();
  };
</script>

<svelte:head>
  <title>Content Management - GetUp Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="pt-16 px-4 md:px-6 lg:px-8">
  <div class="flex justify-end gap-2 mb-4 text-sm text-slate">
    <!-- <span class="font-semibold">CMS:</span>
    <button
      class={`px-3 py-1 rounded border ${
        cmsChoice === "sveltia"
          ? "bg-orange text-white border-orange"
          : "border-slate/40"
      }`}
      on:click={() => switchCms("sveltia")}
    >
      Sveltia
    </button>
    <button
      class={`px-3 py-1 rounded border ${
        cmsChoice === "decap"
          ? "bg-orange text-white border-orange"
          : "border-slate/40"
      }`}
      on:click={() => switchCms("decap")}
    >
      Decap
    </button>
  </div> -->

    <div id="nc-root" class="min-h-screen"></div>

    {#if !cmsLoaded}
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange"
          ></div>
          <p class="mt-4 text-slate">Loading CMS...</p>
        </div>
      </div>
    {/if}
  </div>
</main>
<!-- @ts-nocheck -->
