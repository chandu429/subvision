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
  import MediaQuery from './MediaQuery.svelte';
  import ParachainIcon from './ParachainIcon.svelte';


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

  let contributions, fund, pageInfo, totalRecord, searchAddr, searchedText;
  const contributionsOps = operationStore(CONTRIBUTORS_QUERY, params, { requestPolicy: 'network-only'})
  query(contributionsOps);
  $: {

    if (!contributionsOps.fetching && contributionsOps.data) {
      const data = normalize($contributionsOps.data);
      const { contributions: fundContribution, crowdloan, contributionsPageInfo, contributionsTotal } = data;
      contributions = fundContribution;
      fund = crowdloan;
      pageInfo = contributionsPageInfo;
      totalRecord = contributionsTotal;
    }
    searchedText = $contributionsOps.variables.contributionFilter.account.startsWithInsensitive;
  }

  const updateSearchCriteria = (addr = '') => {
    $contributionsOps.variables.contributionFilter.account.startsWithInsensitive = addr;
    $contributionsOps.variables.before = ''
    $contributionsOps.variables.after = ''
    searchAddr = addr;
  }

  const updateOrderBy = (event) => {
    $contributionsOps.variables.before = ''
    $contributionsOps.variables.after = ''
    $contributionsOps.variables.orderBy = event.target.value || 'BLOCK_NUM_DESC';
  }

</script>
<MediaQuery query="(max-width: 600px)" let:matches={isMobile}>
  <div class="content">
    {#if !isMobile}
      <Breadcrumb links={[{title: 'Auction', path: '/'}, {title: 'Crowdloan', path: '/crowdloan'}, {title: fund?.parachain?.paraId || '' }]}/>
    {/if}
    {#if $contributionsOps.fetching}
      <Loading />
    {:else}
      {#if isMobile}
        <div class="box p-2 mt-4">
          <div class="flex flex-row justify-between items-center">
            <ParachainIcon paraId={fund?.parachain?.paraId} align="start" />
            <div>
              <div class="rounded-full py-1 px-2 text-white text-sm {fund.retiring ? 'bg-yellow-600' : 'bg-blue-500'}">{fund.retiring ? 'Retiring' : 'Active'}</div>
            </div>
          </div>
          <div class="flex flex-row justify-between mt-2.5">
            <div class="text-left">
              <div class="text-xs text-gray-400">Raised / Cap</div>
              <div><Token value={fund.raised} allowZero={true} addSymbol={false} /> / <Token allowZero={true} value={fund.cap} /></div>
              <div class="text-xs">{((fund.raised / fund.cap) * 100).toFixed(2)}%</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-right text-gray-400">Ends</div>
              <div class="text-sm">{getDateFromBlockNum(fund.lockExpiredBlock, $lastBlockNum, $lastBlockTime)}</div>
              <div class="text-xs">{fund.lockExpiredBlock}</div>
            </div>
          </div>
        </div>
        <div class="mt-4 box">
          <div class="p-3 search-box">
            <input class="p-2 w-full border rounded-md outline-none" placeholder="Search wallet address" bind:value={searchAddr} on:keydown={(e) =>
              (e.key === 'Enter') ? void updateSearchCriteria(searchAddr) : void ''
            }/>
            {#if searchAddr}
              <div class="reset-btn" on:click={() => updateSearchCriteria()}><span class="material-icons text-gray-300">cancel</span></div>
            {/if}
          </div>
          <div class="flex flex-row justify-between p-2 items-center">
            <div>{totalRecord} Contributions</div>
            <div class="border p-2 rounded-md">
              <select class="text-sm bg-white outline-none" on:change={updateOrderBy} value={$contributionsOps.variables.orderBy}>
                <optgroup label="Sort By">
                  <option value="BLOCK_NUM_DESC">Latest</option>
                  <option value="BLOCK_NUM_ASC">Earliest</option>
                  <option value="AMOUNT_DESC">Highest Price</option>
                  <option value="AMOUNT_ASC">Lowest Price</option>
                </optgroup>
              </select>
            </div>
          </div>
          <div class="border-t mt-1">
            {#each contributions as contribution, idx}
              <div class="{idx % 2 === 0 ? 'bg-color-even' : 'bg-color-odd'} border-b">
                <div class="w-full p-2">
                  <div class="text-xs text-gray-600">Account</div>
                  <div class="text-xs break-all">{contribution.account}</div>
                </div>
                <div class="flex justify-between px-2">
                  <div class="text-left">
                    <div class="text-xs text-gray-600">Block</div>
                    <div class="text-xs">{contribution.blockNum}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-600">Time</div>
                    <div class="text-right text-xs">{new Date(contribution.createdAt).toLocaleTimeString()}</div>
                    <div class="text-right text-xs">{new Date(contribution.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div class="text-right ">
                    <div class="text-gray-600 text-xs">
                      Amount
                    </div>
                    <div>
                      <Token allowZero={true} value={contribution.amount} />
                    </div>
                    <div class="text-xs text-gray-600">{Big(contribution.amount).div(fund.raised).times(100).toFixed(4)}%</div>
                  </div>
                </div>
              </div>
            {/each}
            <div class="mb-4 border-t border-grey-200 px-3 py-2 flex flex-1 justify-between">
              <div class="text-right text-sm">
                <button class="btn disabled:opacity-50" type="button" role="button" aria-label="Prev Page" title="Prev Page" data-page="prev" 
                  on:click={() => {
                      $contributionsOps.variables.before = pageInfo.startCursor
                      $contributionsOps.variables.after = ""
                    }
                  }
                  disabled={!pageInfo.hasPreviousPage}
                >&lt; Prev</button>
              </div>
              <div class="text-right text-sm">
                <button class="btn disabled:opacity-50" type="button" role="button" aria-label="Next Page" title="Next Page" data-page="next"
                on:click={() => {
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
              <div class="text-base text-left">{totalRecord} Contributions {#if searchedText }found start with "{searchedText}" {/if}</div>
              <div class="flex flex-row items-center flex-grow justify-end">
                <div class="mr-2 search-box flex-grow text-right">
                  <input class="p-2 w-2/4 border rounded-md" placeholder="Search wallet address" bind:value={searchAddr} on:keydown={(e) =>
                    (e.key === 'Enter') ? void updateSearchCriteria(searchAddr) : void ''
                  }/>
                  {#if searchAddr}
                    <div class="reset-btn large-pos" on:click={() => updateSearchCriteria()}><span class="material-icons text-gray-300">cancel</span></div>
                  {/if}
                </div>
                <div>
                  <div class="border p-2 rounded-md ">
                    <select class="text-sm outline-none bg-white" on:change={updateOrderBy} value={$contributionsOps.variables.orderBy}>
                      <optgroup label="Sort By">
                        <option value="BLOCK_NUM_DESC">Latest</option>
                        <option value="BLOCK_NUM_ASC">Earliest</option>
                        <option value="AMOUNT_DESC">Highest Price</option>
                        <option value="AMOUNT_ASC">Lowest Price</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
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
            <div class="border-t border-grey-200 px-6 py-4 flex flex-1 justify-between">
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
    {/if}
  </div>
</MediaQuery>

<style>
  .bg-color-odd {
    background-color: #fffeee; 
  }
  .bg-color-even {
    background-color: #fff;
  }
  .search-box {
    position: relative;
  }
  .reset-btn {
    position: absolute;
    right: 1.30em;
    top: 1.30em;
    transform: scale(0.85, 0.85);
  }
  .large-pos {
    right: 0.55em;
    top: 0.55em;
  }
</style>

