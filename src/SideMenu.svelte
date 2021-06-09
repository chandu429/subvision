<script lang="ts">
  import { Link, useLocation } from 'svelte-navigator';
  const location = useLocation();
  $: path = $location.pathname;
</script>

<nav class="side-nav">
  <Link to="/" class=" flex justify-center">
    <img alt="Subvisio" src="/logo.svg" />
  </Link>

  <div class="side-nav__devider my-6" />
  <ul>
    <li>
      <Link to="/" class="side-menu {path === '/' ? 'side-menu--active' : ''}">
        <div class="side-menu__icon"><span class="material-icons md-18">gavel</span></div>
        <div class="side-menu__title">Auction</div>
      </Link>
    </li>
    <li>
      <Link to="/crowdloan" class="side-menu {path.startsWith('/crowdloan') ? 'side-menu--active' : '' }">
        <div class="side-menu__icon"><span class="material-icons md-18">payments</span></div>
        <div class="side-menu__title">Crowdloan</div>
      </Link>
    </li>
  </ul>
</nav>
