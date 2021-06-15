<script>
  import { operationStore, query } from '@urql/svelte';

  import { AUCTION_QUERY, PARACHAIN_QUERY } from './queries';
  import { normalize } from './utils.ts';

  import orderBy from 'lodash-es/orderBy';
  import { curAuction, chronicle } from './stores';
  import { onMount } from 'svelte';
  import Loading from './Loading.svelte';
  import SlotLeaseChart from './SlotLeaseChart.svelte';
  import Breadcrumb from './Breadcrumb.svelte';
  import ParachainList from './ParachainList.svelte';
  import AuctionPanel from './AuctionPanel.svelte';
  import MediaQuery from './MediaQuery.svelte';


  let timer = 0;

  let slotLeases = [], parachains = []

  const activeAuction = {
    auctionStatusFilter: {
      ongoing: {
        equalTo: true
      }
    }
  };

  const parachainsQuery = operationStore(PARACHAIN_QUERY, {}, { requestPolicy: 'network-only', timeFlag: 0 });
  query(parachainsQuery);

  const activeAuctions = operationStore(AUCTION_QUERY, activeAuction, { requestPolicy: 'network-only', timeFlag: 0 });
  query(activeAuctions);

  onMount(async () => {
    timer = setInterval(() => {
      activeAuctions.update((origin) => {
        origin.context = {...origin.context, timeFlag: Math.random()}
      })
    }, 5000);
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = 0;
      }
    }
  });

  $: {
    if ($activeAuctions.data) {
      const { auctions, parachainLeases: leases } = normalize($activeAuctions.data) || {};
      const [auction] = auctions;
      curAuction.set(auction);
      
      if (leases) {
        slotLeases = leases;
      }

    }
    if ($parachainsQuery.data) {
      const { parachains: paraList } = normalize($parachainsQuery.data) || {};
      parachains = orderBy((paraList || []).map(({ leases, funds, ...rest }) => ({...rest, crowdloan: funds[0], curLease: leases[0] })), ['curLease.firstLease'], ['asc']);
    }
  }


  $: latestBids = $curAuction ? orderBy([].concat($curAuction.latestBids), ['createdAt'], ['desc']).slice(0, 10) : [];

</script>

<div class="content">
  <MediaQuery query="max-width: 600px" let:matches={isMobile}>
    {#if isMobile}
      <Breadcrumb links={[{title: 'Auction'}]}/>
    {/if}
  </MediaQuery>
  
  {#if $activeAuctions.fetching && !chronicle} 
    <Loading />
  {:else}
    <div class="my-4">
    {#if !$curAuction}
      <SlotLeaseChart leases={slotLeases}/>
    {/if}
    </div>
    {#if $curAuction}
      <AuctionPanel {...{curAuction: $curAuction, latestBids} }/>
    {:else}
      <ParachainList {parachains}/>
    {/if}

  {/if}
</div>
