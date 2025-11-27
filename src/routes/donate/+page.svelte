<script>
  import TijuanaEmbed from "$lib/components/tijuana-embed.svelte";

  const donateContent = {
    heading: "Power people-driven change",
    subhead:
      "Your donation fuels independent campaigns that put people before corporate power.",
    embed: "https://www.getup.org.au/campaigns/getup/homepage/make-a-donation",
    body: `
      Every gift helps GetUp members push for climate justice, fair housing, and a more just Australia. We don't take corporate donations — that keeps us accountable to our community, not big business.
    `,
    highlights: [
      "Transparent and member-powered",
      "Campaigns across climate, justice, and fairness",
      "Grassroots organising in every state",
    ],
    image:
      "https://gu-static-hosting.s3.ap-southeast-2.amazonaws.com/gu24-refresh/reference_images/grandmother-with-granddaughter-rally.png",
    ctas: [
      {
        heading: "Start a monthly gift",
        copy: "Provide stable support so campaigns can move fast when it matters.",
        action: "Donate monthly",
      },
      {
        heading: "Make a one-off gift",
        copy: "Back a campaign today and help us scale the fight for change.",
        action: "Donate once",
      },
    ],
  };

</script>

<svelte:head>
  <title>Donate to GetUp!</title>
  <meta
    name="description"
    content="Donate to fuel people-powered campaigns for a fair, flourishing, and just Australia."
  />
</svelte:head>

<main class="bg-white">
  <section class="relative overflow-hidden bg-(--color-sand)">
    <div class="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-6">
        <h1 class="font-display text-3xl md:text-4xl uppercase text-(--color-slate)">
          {donateContent.heading}
        </h1>
        <p class="text-xl text-(--color-slate-light)">
          {donateContent.subhead}
        </p>
        <p class="text-lg text-(--color-slate)">
          {donateContent.body}
        </p>
        <ul class="space-y-3 text-(--color-slate)">
          {#each donateContent.highlights as point}
            <li class="flex items-start gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-(--color-orange) mt-1"></span>
              <span>{point}</span>
            </li>
          {/each}
        </ul>
        <a href="#donate-form" class="btn btn-primary btn-sm u-plus">
          Donate now
        </a>
        <a href="/reports" class="btn btn-ghost btn-sm u-arrow">
          See impact
        </a>
      </div>

      <div class="relative bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div class="h-56 md:h-72 overflow-hidden">
          <img
            src={donateContent.image}
            alt="GetUp community in action"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <p class="font-subheader text-xl uppercase text-(--color-slate)">
              Donate securely
            </p>
            <span class="text-sm text-(--color-slate-light)">
              256-bit encrypted
            </span>
          </div>
          <p class="text-(--color-slate)">
            Choose your amount, frequency, and payment method securely below.
          </p>
          <a class="btn btn-primary btn-block u-plus" href="#donate-form">
            Go to donation form
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-white">
    <div class="max-w-7xl mx-auto px-4 py-10 md:py-14 grid lg:grid-cols-2 gap-6">
      {#each donateContent.ctas as cta, i}
        <div
          class={`p-8 rounded-xl border shadow-sm ${
            i === 0 ? "bg-(--color-orange)" : "bg-(--color-purple)"
          } text-white flex flex-col gap-4`}
        >
          <p class="font-subheader text-2xl uppercase">{cta.heading}</p>
          <p class="text-lg">{cta.copy}</p>
          <a
            class="btn btn-sm bg-white text-(--color-slate) font-extrabold uppercase text-center"
            href="#donate-form"
          >
            {cta.action}
          </a>
        </div>
      {/each}
    </div>
  </section>

  <section id="donate-form" class="bg-white">
    <div class="max-w-5xl mx-auto px-4 pb-16">
      <div class="rounded-xl overflow-hidden shadow-xl border border-gray-100">
        <TijuanaEmbed src={donateContent.embed} />
      </div>
    </div>
  </section>
</main>
