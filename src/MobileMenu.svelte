<script lang="ts">
  import { Link, useLocation } from 'svelte-navigator';
  const location = useLocation();
  $: path = $location.pathname;
  let menuOpen = false;
  const toggleMenu = () => menuOpen = !menuOpen;
</script>

<div class="mobile-menu-bar">
  <Link to="/" class="flex mr-auto">
    <img alt="Subvisio" class="w-40" src="/logo.svg" />
  </Link>
  <button class="btn text-white" aria-label="menu" on:click="{toggleMenu}">
    <span class="material-icons md-light md-18" >menu</span>
  </button>
</div>
<ul class="border-t border-theme-29 py-5 {menuOpen ? '' : 'hidden'}" on:click={toggleMenu}>
  <li>
    <Link to="/#" class="menu">
      <div class="menu__icon"><span class="material-icons md-18">gavel</span></div>
      <div class="menu__title">Auction</div>
    </Link>
  </li>
  <li>
    <Link to="/crowdloan" class="menu">
      <div class="menu__icon"><span class="material-icons md-18">payments</span></div>
      <div class="menu__title">Crowdloan</div>
    </Link>
  </li>
</ul>
