<script>
  import { operationStore, query } from '@urql/svelte';

  import { AUCTION_QUERY, PARACHAIN_QUERY } from './queries';
  import { normalize, getSlotsCombination } from './utils.ts';
  import groupBy from 'lodash-es/groupBy';
  import orderBy from 'lodash-es/orderBy';
  import { curAuction, chronicle } from './stores';
  import { onMount } from 'svelte';
  import Loading from './Loading.svelte';
  import SlotLeaseChart from './SlotLeaseChart.svelte';
  import Breadcrumb from './Breadcrumb.svelte';
  import ParachainList from './ParachainList.svelte';
  import AuctionPanel from './AuctionPanel.svelte';


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
      if (auction) {
        curAuction.set(auction);
      }
      if (leases) {
        slotLeases = leases;
      }
    }
    if ($parachainsQuery.data) {
      parachains = normalize($parachainsQuery.data);
    }
  }

  $: slotsCombination = $curAuction ? getSlotsCombination($curAuction.slotsStart, $curAuction.slotsEnd) : [];
  $: slotsWithWinningBid = slotsCombination.map(({ start, end }) => {
    const { amount, parachain, isCrowdloan, bidder } = $curAuction.winningBids.find(({ firstSlot, lastSlot }) => firstSlot == start && lastSlot == end) || {};
    const { paraId, manager, id, deposit, creationBlock } = parachain || {};
    return { firstSlot: start, lastSlot: end, isCrowdloan, amount, bidder, paraId, manager, id, deposit, creationBlock, start, end };
  })
  $: groupedSlots = orderBy(Object.values(groupBy(slotsWithWinningBid, ({ start, end }) => end - start)), ['length'], ['asc']);
  $: latestBids = $curAuction ? orderBy([].concat($curAuction.winningBids, $curAuction.loseBids), ['createdAt'], ['desc']).slice(0, 10) : [];

</script>

<div class="content">
  <Breadcrumb links={[{title: 'Parachain', path: '/'}, {title: 'Auction'}]}/>
  {#if $activeAuctions.fetching && !chronicle} 
    <Loading />
  {:else}
    <div class="box mt-4">
      <SlotLeaseChart leases={slotLeases}/>
    </div>
    {#if $curAuction}
      <AuctionPanel {...{curAuction: $curAuction, groupedSlots, latestBids} }/>
    {:else}
      <ParachainList {...parachains}/>
    {/if}
  {/if}
  
</div>
