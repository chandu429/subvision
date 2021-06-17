<script lang="ts">
  import { Link, useLocation } from 'svelte-navigator';
  const location = useLocation();
  $: path = $location.pathname;
</script>

<nav class="side-nav">
  <Link to="/" class=" flex justify-center">
    <img alt="Subvisio" src="/logo-white.svg" />
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
    <li class="side-nav__devider my-6"></li>
    <li>
      <Link to="/market" class="side-menu {path.startsWith('/market') ? 'side-menu--active' : '' }">
        <div class="side-menu__icon"><span class="material-icons md-18">monetization_on</span></div>
        <div class="side-menu__title">Market</div>
      </Link>
    </li>
    <li>
      <Link to="/insights" class="side-menu {path.startsWith('/insights') ? 'side-menu--active' : '' }">
        <div class="side-menu__icon"><span class="material-icons md-18">insights</span></div>
        <div class="side-menu__title">Insights</div>
      </Link>
    </li>
    <li>
      <Link to="/staking" class="side-menu {path.startsWith('/staking') ? 'side-menu--active' : '' }">
        <div class="side-menu__icon"><span class="material-icons md-18">toll</span></div>
        <div class="side-menu__title">Staking</div>
      </Link>
    </li>
  </ul>
</nav>
