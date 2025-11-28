<script lang="ts">
  import { parse } from "yaml";
  import willpowerRaw from "../../../../content/donate/willpower.yaml?raw";

  const data = parse(willpowerRaw) ?? {};
  const heading: string = data.heading ?? "Gift in your Will";
  const pitch: string[] = data.pitch ?? [];
  const embed: string = data.embed ?? "";
  const hasVideo = !!embed?.trim();
  const contactHref = "https://form.typeform.com/to/Szk0zH";
</script>

<svelte:head>
  <title>{heading} - GetUp</title>
  <meta name="description" content="Include GetUp in your will to power people-driven change for years to come." />
</svelte:head>

<section class="willpower-hero text-white">
  <div class="willpower-hero__bg"></div>
  <div class="willpower-hero__content">
    <div class="space-y-4">
      <h1>{heading}</h1>
      {#if pitch?.length}
        <div class="space-y-2">
          {#each pitch as line}
            <p class="text-lg md:text-xl">{line}</p>
          {/each}
        </div>
      {/if}
      <div class="flex flex-wrap gap-3">
        <a class="btn btn-primary u-arrow" href={hasVideo ? "#willpower-video" : contactHref}>
          {hasVideo ? "Watch overview" : "Get in touch"}
        </a>
        <a class="btn btn-ghost u-arrow" href={contactHref} target="_blank" rel="noreferrer">
          Get in touch
        </a>
      </div>
    </div>
  </div>
</section>

<section class="v2-basic space-y-12">
  {#if embed?.trim()}
    <div id="willpower-video" class="ratio-box">
      <iframe
        src={embed}
        title="Gift in your Will"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  {/if}

  <div class="space-y-10">
    <div class="space-y-4">
      <h2>Your legacy</h2>
      <p class="text-xl opacity-80">
        We’d love to send you a booklet or discuss the opportunity further. Please
        <a class="underline cursor-pointer" href={contactHref} target="_blank" rel="noreferrer">get in touch</a>.
        In the meantime, here are some details you may find helpful.
      </p>
    </div>

    <div class="space-y-12">
      <div class="space-y-4">
        <h3>What is GetUp’s legal name and ACN?</h3>
        <div class="info-box">
          <p>
            Name: GetUp Limited<br />
            ACN: 114 027 986<br />
            Address: 52 Reservoir St, Surry Hills, NSW 2010
          </p>
        </div>
        <p class="text-lg opacity-80">
          You may also want to share with your solicitor or Trustee Company the example wording below. Please
          <a class="underline" href={contactHref} target="_blank" rel="noreferrer">let us know</a>
          if you would like us to email this to you or send a hard copy.
        </p>
      </div>

      <div class="space-y-4">
        <h3>What wording should I use?</h3>
        <p class="text-lg opacity-80">Below is example wording you may want to include in your Will.</p>
        <div class="info-box">
          <p>
            I give to GetUp Ltd (ACN 114 027 986) of 52 Reservoir St, Surry Hills, NSW 2010 (or its successor)...<br />
            [Choose the statement that best reflects your wishes from the following options]<br />
            - the whole of my estate or<br />
            - [insert number] percent of my estate or<br />
            - the residue of my estate or<br />
            - [insert number] percent of the residue of my estate<br />
            - The amount of $[insert number]<br />
            ...to be used for its purposes after the payment of all debts, funeral and testamentary expenses, duties and taxes payable by my estate.”
          </p>
        </div>
        <p class="text-lg opacity-80">
          Would you like to receive this via email, or a hard copy booklet to hold and read properly?
          <a class="underline" href={contactHref} target="_blank" rel="noreferrer">Get in touch</a>
          and we’ll be happy to oblige!
        </p>
      </div>

      <div class="space-y-4">
        <h3>What type of gift can I leave?</h3>
        <p class="text-lg opacity-80">
          We ask GetUp members to leave a residual bequest if they can. A residual bequest is one in which you leave a portion of your estate to GetUp.
        </p>
        <p class="text-lg opacity-80">Residual bequests are beneficial because:</p>
        <ul class="list-disc list-inside text-lg opacity-80 space-y-2">
          <li>They hold their value over time, regardless of inflation.</li>
          <li>They automatically adjust to changes in your estate’s value.</li>
          <li>You can make sure your loved ones are taken care of first.</li>
        </ul>
        <p class="text-lg opacity-80">
          If you prefer, you can nominate a specific amount of money to be left to GetUp in your Will. These gifts are referred to as pecuniary bequests.
        </p>
      </div>

      <div class="space-y-4">
        <h3>Letting us know</h3>
        <p class="text-lg opacity-80">
          When you leave your bequest to GetUp, it would be great if you could let us know. You don’t have to, but we’d love to thank you personally and talk about how your visionary gift could be used.
          It’s also helpful for us to know that members are supporting the movement in this way.
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <a class="btn btn-secondary w-full sm:w-auto" href={contactHref} target="_blank" rel="noreferrer">
        Get in touch
      </a>
      <div class="info-box">
        <p>Alternatively you can contact our Donations Team</p>
        <p>
          Email:
          <a class="underline" href="mailto:donations@getup.org.au">donations@getup.org.au</a><br />
          Phone:
          <a class="underline" href="tel:02 8188 2888">02 8188 2888</a><br />
          Post: PO Box 190, Surry Hills, NSW 2010
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .willpower-hero {
    position: relative;
    overflow: hidden;
    min-height: 360px;
    display: flex;
    align-items: center;
    background: linear-gradient(120deg, rgba(38, 38, 45, 0.8), rgba(252, 102, 31, 0.7));
  }

  .willpower-hero__bg {
    position: absolute;
    inset: 0;
    background-image: url("/images/media-header.jpg");
    background-size: cover;
    background-position: center;
    opacity: 0.45;
  }

  .willpower-hero__content {
    position: relative;
    width: 100%;
    max-width: 72rem;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }

  .ratio-box {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  }

  .ratio-box iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .info-box {
    padding: 1.25rem;
    border-radius: 0.5rem;
    background: #f4f5f7;
    border: 1px solid #e5e7eb;
  }
</style>
