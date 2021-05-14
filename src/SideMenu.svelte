<script lang="ts">
  import { Link, useLocation } from 'svelte-navigator';
  const location = useLocation();
  $: path = $location.pathname;
</script>

<nav class="side-nav">
  <Link to="/" class="intro-x flex justify-center">
    <img alt="Subvisio" src="/logo.svg" />
  </Link>

  <div class="side-nav__devider my-6" />
  <ul>
    <li>
      <a href="/" class="side-menu side-menu--active">
        <div class="side-menu__icon"><i data-feather="home" /></div>
        <div class="side-menu__title">
          Parachain
          <div class="side-menu__sub-icon"><i data-feather="chevron-down" /></div>
        </div>
      </a>
      <ul class="side-menu__sub-open">
        <li>
          <Link to="/" class="side-menu {path === '/' ? 'side-menu--active' : ''}">
            <div class="side-menu__icon"><i data-feather="activity" /></div>
            <div class="side-menu__title">Auction</div>
          </Link>
        </li>
        <li>
          <Link to="/crowdloan" class="side-menu {path.startsWith('/crowdloan') ? 'side-menu--active' : '' }">
            <div class="side-menu__icon"><i data-feather="activity" /></div>
            <div class="side-menu__title">Crowdloan</div>
          </Link>
        </li>
      </ul>
    </li>
  </ul>
</nav>
