<script>
  import { operationStore, query } from '@urql/svelte';

  import { AUCTION_QUERY, PARACHAIN_QUERY } from './queries';
  import { normalize } from './utils.ts';

  import orderBy from 'lodash-es/orderBy';
  import { curAuction, chronicle, lastBlockNum } from './stores';
  import { onMount } from 'svelte';
  import Loading from './Loading.svelte';
  import SlotLeaseChart from './SlotLeaseChart.svelte';
  import Breadcrumb from './Breadcrumb.svelte';
  import ParachainList from './ParachainList.svelte';
  import AuctionPanel from './AuctionPanel.svelte';
  import MediaQuery from './MediaQuery.svelte';
  import WinnerBanner from './WinnerBanner.svelte';


  let timer = 0;
  let initFetch = true;
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
      initFetch = false;
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
  $: latestWinner = orderBy(slotLeases, ['winningResultBlock'], ['desc']).filter(({ winningResultBlock }) => $lastBlockNum - winningResultBlock <= 172800 )[0];
  
</script>

<div class="content">
  <MediaQuery query="max-width: 600px" let:matches={isMobile}>
    {#if isMobile}
      <Breadcrumb links={[{title: 'Auction'}]}/>
    {/if}
  </MediaQuery>
  
  {#if $activeAuctions.fetching && initFetch}
    <Loading />
  {:else}
    {#if latestWinner}
      <div class="mt-6 mb-4">
        <WinnerBanner paraId={latestWinner.parachain.paraId} firstLease={latestWinner.firstLease} lastLease={latestWinner.lastLease} winningAmount={latestWinner.winningAmount}/>
      </div>
    {/if}
    <div class="my-2 sm:mt-6 md:mt-6 lg:mt-6">
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
