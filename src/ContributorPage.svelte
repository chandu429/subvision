<script>
  import { operationStore, query } from '@urql/svelte';
  import { lastBlockNum, lastBlockTime } from './stores.ts';
  import { CONTRIBUTORS_QUERY } from './queries.ts';
  import Token from './Token.svelte';
  import Big from 'big.js';
  import { normalize } from './utils.ts';
  import { getDateFromBlockNum } from './utils';
  import Loading from './Loading.svelte';
  import Breadcrumb from './Breadcrumb.svelte';

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
  <Breadcrumb links={[{title: 'Parachain', path: '/'}, {title: 'Crowdloan', path: '/crowdloan'}, {title: fundId, }]}/>

  {#if $contributionsOps.fetching}
  <Loading />
  {:else}
  <div class="mt-6">
    <div class="text-lg mb-4">Latest Contributions</div>
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