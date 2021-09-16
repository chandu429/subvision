<script>
  import { operationStore, query } from '@urql/svelte';
  import { navigate } from "svelte-navigator";
  import { lastBlockNum, lastBlockTime } from './stores.ts';
  import { CROWDLOAN_QUERY } from './queries.ts';
  import Token from './Token.svelte';
  import { getDateFromBlockNum } from './utils';
  import { Link } from 'svelte-navigator';
  import Loading from './Loading.svelte';
  import Breadcrumb from './Breadcrumb.svelte';
  import ParachainIcon from './ParachainIcon.svelte';
  import { onMount } from 'svelte';
  import MediaQuery from './MediaQuery.svelte';

  let timer = 0, selectedStatus = 'Active', loaded = false;

  const crowdloanOps = operationStore(CROWDLOAN_QUERY, null, { requestPolicy: 'network-only'})
  query(crowdloanOps);

  onMount(async () => {
    if (!timer) {
      timer = setInterval(() => {
        crowdloanOps.update((origin) => {
          origin.context = {...origin.context, timeFlag: Math.random()}
        })
      }, 2500);
    }

    return () => {
      clearInterval(timer);
      timer = 0;
    }
  });

  $: if (!loaded) {
    loaded = !$crowdloanOps.fetching;
    console.log({loaded});
  }

  console.log($crowdloanOps.data?.crowdloans.nodes);
  $: crowdloans = ($crowdloanOps.data?.crowdloans.nodes || [])
    .filter(loan => selectedStatus === 'Active'
      ? loan.status === 'Started'
      : selectedStatus === 'Completed'
        ? loan.status === 'Won'
        : selectedStatus === 'Retired'
          ? loan.status === 'Retiring' || loan.status === 'Dissolved'
          : false);

  $: {
    if(crowdloans && selectedStatus === 'Completed'){
	  crowdloans.sort((crowdloanA, crowdloanB) => crowdloanB.wonAuctionId - crowdloanA.wonAuctionId)
    }

	if(crowdloans && selectedStatus === 'Retired'){
	  crowdloans.sort((crowdloanA, crowdloanB) => crowdloanB.lockExpiredBlock - crowdloanA.lockExpiredBlock)
    }
  }

</script>

<MediaQuery query="(max-width: 600px)" let:matches={isMobile}>

<div class="content">
  {#if !isMobile}
    <Breadcrumb links={[{title: 'Auction', path: '/'}, {title: 'Crowdloan'}]}/>
  {/if}
  {#if $crowdloanOps.fetching && !loaded}
    <Loading />
  {:else}
    <div class="w-full flex flex-row justify-center mt-6">
      <div class="{isMobile ? 'flex-grow' : 'flex-grow-0'}">
        <button on:click={() => {selectedStatus = 'Active'}} class="outline-none border-b w-full rounded-l-sm py-2 px-6 {selectedStatus === 'Active' ? 'bg-white border-gray-500' : 'hover:bg-gray-100 bg-gray-200'} ">Active</button>
      </div>
      <div class="{isMobile ? 'flex-grow' : 'flex-grow-0'}">
        <button on:click={() => {selectedStatus = 'Completed'}} class="border-b w-full rounded-none py-2 px-6 {selectedStatus === 'Completed' ? 'bg-white border-gray-500' : 'hover:bg-gray-100 bg-gray-200'}">Completed</button>
      </div>
      <div class="{isMobile ? 'flex-grow' : 'flex-grow-0'}">
        <button on:click={() => {selectedStatus = 'Retired'}} class="border-b w-full rounded-r-sm py-2 px-6 {selectedStatus === 'Retired' ? 'bg-white border-gray-500' : 'hover:bg-gray-100 bg-gray-200'}">Retired</button>
      </div>
    </div>
    {#if !crowdloans.length && loaded}
      <div class="text-center mt-20">
        <span class="text-lg text-gray-600">No <b>{selectedStatus}</b> Crowdloan Found</span>
      </div>
    {:else}
      {#if isMobile}
        {#each crowdloans as crowdloan (crowdloan.id) }
          <div class="box mb-4 mt-6 p-2" on:click={e => navigate(`/crowdloan/${crowdloan.id}`)}>
            <div class="flex flex-row justify-between">
              <ParachainIcon paraId={crowdloan.parachain.paraId} align="start" smallIcon />
              <div>
                <div class="rounded-full py-1 px-2 text-white text-sm {crowdloan.status !== 'Started' ? 'bg-yellow-600' : 'bg-blue-500'}">{crowdloan.status}</div>
              </div>
            </div>
            <div class="flex justify-between mt-2">
              <div class=" text-left">
                <div class="text-xs text-gray-400">Lease</div>
                <div class="text-lg">{crowdloan.firstSlot} - {crowdloan.lastSlot}</div>
              </div>

              <div class="text-right">
                <div class="text-xs  text-gray-400">Contributions</div>
                <div class="text-lg">{(crowdloan.contributions?.totalCount || 0).toLocaleString()}</div>
              </div>
            </div>
            <div class="flex justify-between mt-1">
              <div class="text-left">
                <div class="text-xs text-gray-400">Expiration</div>
                <div class="">{getDateFromBlockNum(crowdloan.lockExpiredBlock, $lastBlockNum, $lastBlockTime)}</div>
                <div class="text-xs">Block: {crowdloan.lockExpiredBlock}</div>
              </div>
              <div class="text-right">
                <div class="text-xs  text-gray-400">Raised / Cap</div>
                <div><Token value={crowdloan.raised} allowZero={true} addSymbol={false} /> / <Token allowZero={true} value={crowdloan.cap} /></div>
                <div class="text-xs">{((crowdloan.raised / crowdloan.cap) * 100).toFixed(2)}%</div>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="mt-6 overflow-auto lg:overflow-visible">
          <table class="table table-report -mt-2">
            <thead>
              <tr>
                <th class="whitespace-nowrap">Parachain</th>
                <th class="text-center whitespace-nowrap">First Lease</th>
                <th class="text-center whitespace-nowrap">Last Lease</th>
                <th class="text-right whitespace-nowrap">Raised / Cap</th>
                <th class="text-right whitespace-nowrap">Contributions</th>
                <th class="text-right whitespace-nowrap">Expiration</th>
                <th class="text-center whitespace-nowrap">Status</th>
                <th class="text-center whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {#each crowdloans as crowdloan (crowdloan.id) }
                <tr class="intro-x zoom-in" on:click={e => navigate(`/crowdloan/${crowdloan.id}`)}>
                  <td class="">
                    <ParachainIcon paraId={crowdloan.parachain.paraId} align="start"/>
                  </td>
                  <!-- <td class="md:table-cell">
                    <div class="text-gray-600 whitespace-nowrap ellipsis-text lg:w-40 sm:w-6" title={crowdloan.depositor}>{crowdloan.depositor}</div>
                  </td> -->
                  <td><div class="text-center ">{crowdloan.firstSlot}</div></td>
                  <td><div class="text-center ">{crowdloan.lastSlot}</div></td>
                  <td>
                    <div class="text-right"><Token value={crowdloan.raised} allowZero={true} addSymbol={false} /> / <Token allowZero={true} value={crowdloan.cap} /></div>
                    <div class="text-right">{((crowdloan.raised / crowdloan.cap) * 100).toFixed(2)}%</div>
                  </td>
                  <td>
                    <div class="text-right">{crowdloan.contributions?.totalCount || 0}</div>
                  </td>
                  <td class="">
                    <div class="text-right">Block: {crowdloan.lockExpiredBlock}</div>
                    <div class="text-right text-gray-600">{getDateFromBlockNum(crowdloan.lockExpiredBlock, $lastBlockNum, $lastBlockTime)}</div>
                  </td>
                  <td class="">
                    <div class="flex justify-center items-center">{crowdloan.status}</div>
                  </td>
                  <td class="text-center">
                    <Link to="/crowdloan/{crowdloan.id}" class="btn text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {/if}
  {/if}
  </div>
</MediaQuery>

<style>
  .ellipsis-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
