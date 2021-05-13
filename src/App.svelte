<script>
  import { Router, Route } from 'svelte-navigator';
  import MobileMenu from './MobileMenu.svelte';
  import SideMenu from './SideMenu.svelte';
  import Layout from './Layout.svelte';
  import AuctionPage from './AuctionPage.svelte';
  import Tailwind from './Tailwind.svelte';
  import { initClient } from '@urql/svelte';
  import { config } from './constants';

  initClient({
    url: config.endpoint
  });
</script>

<Tailwind />

<Router>
  <main class="main">
    <Layout>
      <div slot="mobile-menu">
        <MobileMenu />
      </div>
      <div slot="side-menu"><SideMenu /></div>
      <div slot="content">
        <Route path="/">
          <AuctionPage />
        </Route>
      </div>
    </Layout>
  </main>
</Router>
