<script>
  import "../app.css";
  import "$lib/styles/v2-basic.css";
  import { setContext } from "svelte";
  import { page } from "$app/stores";
  import Header from "$lib/components/header.svelte";
  import Footer from "$lib/components/footer.svelte";
  import SignupModal from "$lib/components/signup-modal.svelte";
  import SideMenu from "$lib/components/side-menu.svelte";

  let { children } = $props();

  let signupModalOpen = $state(false);
  let sideMenuOpen = $state(false);

  function openSignup() {
    signupModalOpen = true;
  }

  function closeSignup() {
    signupModalOpen = false;
  }

  function openSideMenu() {
    sideMenuOpen = true;
  }

  function closeSideMenu() {
    sideMenuOpen = false;
  }

  setContext("modals", {
    openSignup,
    openSideMenu,
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;800&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://gu-static-hosting.s3.ap-southeast-2.amazonaws.com/fonts/getup-2025/adelle.css"
  />
</svelte:head>
<div class="min-h-screen bg-white">
  {#if !$page.url.pathname.startsWith("/edit")}
    <Header onOpenSignup={openSignup} />
  {/if}

  {@render children()}

  {#if !$page.url.pathname.startsWith("/edit")}
    <Footer />
  {/if}

  <!-- Modals & Overlays -->
  {#if !$page.url.pathname.startsWith("/edit")}
    <SignupModal isOpen={signupModalOpen} onClose={closeSignup} />
    <SideMenu
      isOpen={sideMenuOpen}
      onClose={closeSideMenu}
      onOpenSignup={openSignup}
    />
  {/if}
</div>
