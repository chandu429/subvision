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

<script>
  export let paraId, smallIcon = false, align='center', showText=true;
  const parachain = paraMappings[paraId];
</script>

<div class="flex items-center justify-{align}"> 
  <div class="{smallIcon ? 'w-6 h-6' : 'w-10 h-10'} flex-none image-fit rounded-full overflow-hidden mr-1">
    <img alt="{parachain?.name || paraId}" src="{parachain?.icon || config.defaultParachainIcon}">
  </div>
  {#if showText}
  <div class="text-sm">
    {#if parachain}
      <div title={paraId}>{parachain?.name}</div>
    {:else}
      {paraId || ''}
    {/if}
  </div>
  {/if}
</div>