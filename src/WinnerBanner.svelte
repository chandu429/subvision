<script>
import ParachainIcon from "./ParachainIcon.svelte";
import Token from "./Token.svelte";
import { config } from './constants';
import { paraMappings } from './stores';
import MediaQuery from "./MediaQuery.svelte";

const { leasePeriod } = config;
export let paraId, winningAmount, firstLease, lastLease;


</script>


<div class="box flex flex-col flex-1 p-4 relative banner">
  <div class="banner-content">
    <div class="text-lg text-center mb-2 text-black">Congratulations to Auction Winner! 🎉</div>
    <div class="flex flex-row items-center justify-evenly flex-wrap">
      <div class="my-1">
        <MediaQuery query="(max-width: 600px)" let:matches={isMobile}>
          <ParachainIcon paraId={paraId} align="start" dropShadow={true} smallIcon={isMobile}/>
        </MediaQuery>
      </div>
      <div class="flex flex-col text-center my-1">
        <div class="text-xs text-gray-600">Leases</div>
        <div class="text-base">{firstLease} - {lastLease}</div>
      </div>
      <div class="flex flex-col text-center my-1">
        <div class="text-xs text-gray-600">Winning Amount</div>
        <div class="text-base">
          <Token value={winningAmount} />
        </div>
      </div>
      <div class="flex flex-col text-center my-1">
        <div class="text-xs text-gray-600">Unlock Block</div>
        <div class="text-base">{lastLease * leasePeriod + 1}</div>
      </div>
    </div>
  </div>
</div>

<style>
  .banner-content {
    position: relative;
    z-index: 100;
  }
  .banner {
    text-shadow: 2px 2px 3px #d4d4fa;
    position: relative;
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
    /* background-color: #ffffff; */
/* opacity: 0.8; */
/* background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 25px ), repeating-linear-gradient( #f3d7e355, #f3d7e3 ); */
  }

</style>
