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
    contributionFilter: {
      fundId: {
        equalTo: fundId
      },
      account: {
        startsWithInsensitive: ''
      }
    },
    after: "",
    next: "",
    orderBy: "BLOCK_NUM_DESC"
  }

  let contributions, fund, pageInfo, totalRecord, searchAddr;
  const contributionsOps = operationStore(CONTRIBUTORS_QUERY, params, { requestPolicy: 'network-only'})
  query(contributionsOps);
  $: {
    console.log('refetch')
    if (!contributionsOps.fetching && contributionsOps.data) {
      const data = normalize($contributionsOps.data);
      const { contributions: fundContribution, crowdloan, contributionsPageInfo, contributionsTotal } = data;
      contributions = fundContribution;
      fund = crowdloan;
      pageInfo = contributionsPageInfo;
      totalRecord = contributionsTotal;
    }
  }

  const updateSearchCriteria = (addr = '') => {
    $contributionsOps.variables.contributionFilter.account.startsWithInsensitive = addr;
    $contributionsOps.variables.before = ''
    $contributionsOps.variables.after = ''
    searchAddr=addr;
  }

  const updateOrderBy = (event) => {
    console.log(event.target.value)
    $contributionsOps.variables.before = ''
    $contributionsOps.variables.after = ''
    $contributionsOps.variables.orderBy = event.target.value || 'BLOCK_NUM_DESC';
  }

</script>

<div class="content">
  <Breadcrumb links={[{title: 'Parachain', path: '/'}, {title: 'Crowdloan', path: '/crowdloan'}, {title: fund?.parachain?.paraId || '' }]}/>

  {#if $contributionsOps.fetching}
  <Loading />
  {:else}

  <div class="mt-6">
    <div class="p-4 flex justify-between">
      <div class="text-lg">Contributions ({totalRecord})</div>
      <div class="text-right">
        Raised/Cap: <Token value={fund.raised} allowZero={true} addSymbol={false} /> / <Token allowZero={true} value={fund.cap} />
        <p>Unlock block: {fund.lockExpiredBlock}</p>
        <p>{fund ? getDateFromBlockNum(fund.lockExpiredBlock, $lastBlockNum, $lastBlockTime) : ''}</p>
        <p>{fund?.retiring ? 'Inactive' : 'Active'}</p>
      </div>
    </div>
      <div class="intro-y box">
        <div class="border-b border-gray-200 p-4 items-center flex justify-between">
          <div class="text-base text-left">{totalRecord} Contributions {#if searchAddr }found start with "{searchAddr}" {/if}</div>
          <div class="flex flex-row">
            <input type="text" class="form-control w-full mx-4" placeholder="Contributor address" bind:value={searchAddr}>
            <button class="btn btn-primary disabled:opacity-50 mr-4" 
              disabled={!searchAddr}
              on:click={() => updateSearchCriteria(searchAddr)}>Search</button>
            <button class="btn" 
              on:click={() => updateSearchCriteria()}>Reset</button>
            <select class="form-select box w-full lg:w-auto ml-4 text-sm" on:change={updateOrderBy} value={$contributionsOps.variables.orderBy}>
              <option>Short By</option>
              <option value="BLOCK_NUM_DESC">Latest</option>
              <option value="BLOCK_NUM_ASC">Earliest</option>
              <option value="AMOUNT_DESC">Highest Price</option>
              <option value="AMOUNT_ASC">Lowest Price</option>
          </select>
          </div>
        </div>
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
              <tr class="odd:bg-gray-100">
                <td class="border-b dark:border-dark-5">{contribution.account}</td>
                <td class="border-b dark:border-dark-5 text-right"><Token allowZero={true} value={contribution.amount} /></td>
                <td class="border-b dark:border-dark-5 text-right">{Big(contribution.amount).div(fund.raised).times(100).toFixed(4)}%</td>
                <td class="border-b dark:border-dark-5 text-right">
                  <div class="text-right">Block: {contribution.blockNum}</div>
                  <div class="text-right">{new Date(contribution.createdAt).toLocaleTimeString()} {new Date(contribution.createdAt).toLocaleDateString()}</div>
                </td>
              </tr>
              {/each}
              {:else}
              <tr>
                <td colspan="4" class="text-center"><div class="py-5 text-xl text-gray-600">No contributions yet</div></td>
              </tr>
              {/if}
            </tbody>
          </table>
        </div>
        <div class="mt-6 border-t border-grey-200 px-6 py-4 flex flex-1 justify-between">
          <div class="text-right">
            <button class="btn disabled:opacity-50" type="button" role="button" aria-label="Prev Page" title="Prev Page" data-page="prev" 
              on:click={() => {
                  $contributionsOps.variables.before = pageInfo.startCursor
                  $contributionsOps.variables.after = ""
                }
              }
              disabled={!pageInfo.hasPreviousPage}
            >&lt; Prev</button>
          </div>
          <div class="text-right">
            <button class="btn disabled:opacity-50" type="button" role="button" aria-label="Next Page" title="Next Page" data-page="next"
            on:click={() => {
                console.log(pageInfo.endCursor);
                $contributionsOps.variables.before = ""
                $contributionsOps.variables.after = pageInfo.endCursor
              }
            }
            disabled={!pageInfo.hasNextPage}
            >Next &gt;</button>
          </div>
        </div>
      </div>
  </div>
  {/if}
</div>

