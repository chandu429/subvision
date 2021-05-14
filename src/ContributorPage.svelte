<script>
  import { operationStore, query } from '@urql/svelte';
  import { timeStr, lastBlockNum, lastBlockTime } from './stores.ts';
  import { CONTRIBUTORS_QUERY } from './queries.ts';
  import Token from './Token.svelte';
  import Big from 'big.js';
  import { Link } from 'svelte-navigator';
  import { normalize } from './utils.ts';
  import { getDateFromBlockNum } from './utils';
  import Loading from './Loading.svelte';

  export let fundId;

  const params = {
    fundId,
    fundIdFilter: {
      fundId: {
        equalTo: fundId
      }
    }
  }

  let contributions, fund;
  const contributionsOps = operationStore(CONTRIBUTORS_QUERY, params, { requestPolicy: 'network-only'})
  query(contributionsOps);
  $: {
    if (!contributionsOps.fetching && contributionsOps.data) {
      const { contributions: fundContribution, crowdloan } = normalize($contributionsOps.data);
      contributions = fundContribution;
      fund = crowdloan;
    }
  }

</script>

<div class="content">
  <div class="top-bar">
    <div>
      Parachain <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-right breadcrumb__icon"><polyline points="9 18 15 12 9 6" /></svg
      > <Link to="/crowdloan" class="breadcrumb--active">Crowdloan</Link> <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-chevron-right breadcrumb__icon"><polyline points="9 18 15 12 9 6" /></svg
    > {fundId}
    </div>
    <div class="text-right flex-1">
      {$timeStr}
    </div>
  </div>

  {#if $contributionsOps.fetching}
  <Loading />
  {:else}
  <div class="mt-6">
    <div class="overflow-x-auto"> 
      <table class="table">
        <thead>
          <tr>
            <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">Contributor</th>
            <th class="border-b-2 dark:border-dark-5 whitespace-nowrap text-right">Amount</th>
            <th class="border-b-2 dark:border-dark-5 whitespace-nowrap text-right">Ratio</th>
            <th class="border-b-2 dark:border-dark-5 whitespace-nowrap text-right">Contributed at</th>
          </tr>
        </thead>
        <tbody>
          {#if contributions?.length}
          {#each contributions as contribution, i (contribution.id)}
          <tr class="{i % 2 == 0 ? 'bg-gray-200' : ''} dark:bg-dark-1">
            <td class="border-b dark:border-dark-5">{contribution.account}</td>
            <td class="border-b dark:border-dark-5 text-right"><Token allowZero={true} value={contribution.amount} /></td>
            <td class="border-b dark:border-dark-5 text-right">{Big(contribution.amount).div(fund.raised).times(100).toFixed(4)}%</td>
            <td class="border-b dark:border-dark-5 text-right">
              <div class="text-right">{contribution.blockNum}</div>
              <div class="text-right">{getDateFromBlockNum(contribution.blockNum, $lastBlockNum, $lastBlockTime)}</div>
            </td>
          </tr>
          {/each}
          {:else}
          <tr>
            <td colspan="4" class="text-center"><div class="py-5 text-xl text-gray-600">No contributions found</div></td>
          </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
  {/if}
  
</div>

<style>
  /* .ellipsis-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  } */
</style>