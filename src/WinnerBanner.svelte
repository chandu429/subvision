<script>
import ParachainIcon from "./ParachainIcon.svelte";
import Token from "./Token.svelte";
import { config } from './constants';
import { paraMappings } from './stores';

const { leasePeriod } = config;
export let paraId, winningAmount, firstLease, lastLease, auctionId;

</script>


<div class="box flex flex-col flex-1 p-4 flex-wrap relative banner ">

  <div class="text-lg text-center mb-2 text-black">Congratulations to Auction {auctionId} winner!</div>
  <div class="flex flex-row items-center justify-evenly">
    <ParachainIcon paraId={paraId} align="start" dropShadow={true} />
    <div class="flex flex-col text-center">
      <div class="text-xs text-gray-600">Leases</div>
      <div class="text-base">{firstLease} - {lastLease}</div>
    </div>
    <div class="flex flex-col text-center">
      <div class="text-xs text-gray-600">Winnig Amount</div>
      <div class="text-base">
        <Token value={winningAmount} />
      </div>
    </div>
    <div class="flex flex-col text-center">
      <div class="text-xs text-gray-600">Unlock Block</div>
      <div class="text-base">{lastLease * leasePeriod + 1}</div>
    </div>
  </div>
</div>

<style>
  .banner {
    text-shadow: 2px 2px 4px #444cf755;
  }
  .banner::after {
    content: "";
    border-radius: 0.45rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: #d4d4fa;
    opacity: 0.2;
    background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, #d4d4fa 25px ), repeating-linear-gradient( #444cf755, #444cf7 );
  }

</style>