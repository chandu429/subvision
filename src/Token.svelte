<script>
  import Big from 'big.js';
  import { config } from './constants';
  export let value;
  export let allowZero = false;
  export let emptyDisplay = '';
  export let addSymbol = true;

  const { decimal, tokenSymbol } = config;
  $: tokenValue = Big(value||0).div(10 ** decimal).toNumber();
  $: title = !allowZero && tokenValue == 0 ? emptyDisplay : tokenValue + (addSymbol ? ` ${tokenSymbol}` : '');
</script>

<div class="inline-block">{title}</div>