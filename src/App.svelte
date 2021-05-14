<script>
  import { Router, Route, useParams } from 'svelte-navigator';
  import MobileMenu from './MobileMenu.svelte';
  import SideMenu from './SideMenu.svelte';
  import Layout from './Layout.svelte';
  import AuctionPage from './AuctionPage.svelte';
  import CrowdloanPage from './CrowdloanPage.svelte';
  import ContributorPage from './ContributorPage.svelte';
  import Tailwind from './Tailwind.svelte';
  import { initClient } from '@urql/svelte';
  import { config } from './constants';
  import { operationStore, query } from '@urql/svelte';
  import { CHRONICLE_QUERY } from './queries';
  import { onMount, onDestroy } from 'svelte';
  import { normalize } from './utils';
  import { chronicle } from './stores';


  initClient({
    url: config.endpoint
  });

  let timer = 0;

  const chronicleOps = operationStore(CHRONICLE_QUERY, null, { requestPolicy: 'network-only', timeFlag: 0 });
  query(chronicleOps);

  onMount(async () => {
    if (!timer) {
      timer = setInterval(() => {
        chronicleOps.update((origin) => {
          origin.context = {...origin.context, timeFlag: Math.random()}
        })
      }, 2500);
    }

    return () => {
      clearInterval(timer);
      timer = 0;
    }
  });

  $: {
    const { chronicle: curChronicle } = normalize($chronicleOps.data) || {};
    if (curChronicle) {
      chronicle.set(curChronicle)
    }
  }

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
        <Route path="/" component={AuctionPage} />
        <Route path="/crowdloan" component={CrowdloanPage} />
        <Route path="/crowdloan/:id" let:params>
          <ContributorPage fundId={params.id} />
        </Route>
      </div>
    </Layout>
  </main>
</Router>
