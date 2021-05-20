<script>
  import { operationStore, query } from '@urql/svelte';
  import AuctionSlot from './AuctionSlot.svelte';
  import { AUCTION_QUERY, PARACHAIN_QUERY } from './queries';
  import { normalize, getSlotsCombination } from './utils.ts';
  import groupBy from 'lodash-es/groupBy';
  import orderBy from 'lodash-es/orderBy';
  import BidCard from './BidCard.svelte';
  import AuctionProgressIndicator from './AuctionProgressIndicator.svelte';
  import { curAuction, chronicle } from './stores';
  import { onMount } from 'svelte';
  import Loading from './Loading.svelte';
  import SlotLeaseChart from './SlotLeaseChart.svelte';
  import Breadcrumb from './Breadcrumb.svelte';
  import ParachainList from './ParachainList.svelte';
import App from './App.svelte';
import ChevronIcon from './ChevronIcon.svelte';
import ContributorPage from './ContributorPage.svelte';

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
      const { auctions, parachainLeaseds: leases } = normalize($activeAuctions.data) || {};
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

  $: slotsCombination = $curAuction ? getSlotsCombination($curAuction.slotsStart, curAuction.slotsEnd) : [];
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
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-12 xl:col-span-12 mt-2">
          <div class="block sm:flex items-center h-10">
            <h2 class="text-lg font-medium mr-5">Current Auction</h2>
          </div>

          <div class="mt-4 sm:mt-1">
            <div class="box grid grid-cols-5 gap-4 divide-x divide-gray-200 p-4">
              <div class="justify-center">
                <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Auction Index</div>
                <div class="text-3xl font-bold mt-4 text-center">{$curAuction?.id || ''}</div>
              </div>
              <div class="justify-center">
                <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Current Lease</div>
                <div class="text-3xl font-bold mt-4 text-center">{$curAuction?.slotsStart || ''} - {$curAuction?.slotsEnd || ''}</div>
              </div>
              <div class="justify-center">
                <div class="mt-1 text-gray-600 dark:text-gray-600 text-center">Current Block</div>
                <div class="text-3xl font-bold mt-4 text-center">{$chronicle?.curBlockNum}</div>
              </div>
              <AuctionProgressIndicator closingStart={$curAuction?.closingStart } closingEnd={ $curAuction?.closingEnd} curBlockNum={$chronicle?.curBlockNum} auctionStart={$curAuction?.blockNum} />
            </div>
          </div>
        </div>
        <div class="col-span-8 m:col-span-12 s:col-span-12 my-4">
          <div class="py-2 text-lg">
            <p>Auction Slots</p>
          </div>
          <div class="">
            <div class="">
            {#each groupedSlots as slots, groupIdx}
              <div class="box mb-6 py-4">
                <div class="pl-4 text-base">
                  <p>Group {slots.length}</p>
                </div>
                <div class="grid grid-cols-12 gap-6 gap-y-8 p-4">
                  {#each slots as slot }
                    <AuctionSlot {...slot } {groupIdx}/>
                  {/each}
                </div>
              </div>
            {/each}
            </div>
          </div>
        </div>
        <div class="col-span-4 m:col-span-12 s:col-span-12 mt-4">
          <div class="py-2 text-lg">
            <p>Live Bids</p>
          </div>
          <div >
            {#each latestBids as bid}
              <BidCard { ...bid } />
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <ParachainList {...parachains}/>
    {/if}
  {/if}
  
</div>
