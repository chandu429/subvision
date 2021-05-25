<script context="module" lang="typescript">
  interface ParachainInfo {
    paraid: string;
    name: string;
    token: string;
    description: string;
    website: string;
    icon: string;
  }
  
  import { config } from './constants';

  let paraMappings: Record<string, ParachainInfo> = {};
  fetch(config.paraMappingUrl)
    .then(response => response.json() as Promise<ParachainInfo[]>)
    .then((data: ParachainInfo[]) => {
      paraMappings = (data || []).reduce((all, { paraid, ...rest}) => ({...all, [paraid]: rest, id: paraid }), {})
    });

</script>

<script lang="typescript">
  export let paraId;
  const parachain = paraMappings[paraId];
</script>

<div class="flex items-center"> 
  <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden mr-2">
    <img alt="{parachain?.name || paraId}" src="{parachain?.icon || config.defaultParachainIcon}">
  </div>
  <div class="text-base">
    {#if parachain}
    {parachain?.name}
      <p class="text-xs">{paraId}</p>
    {:else}
      {paraId}
    {/if}
  </div>
</div>