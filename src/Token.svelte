<script>
  import Big from 'big.js';
  import { config } from './constants';
  import { round } from 'lodash-es';

  export let value;
  export let allowZero = false;
  export let emptyDisplay = '';
  export let addSymbol = true;
  export let isPrecise = false;

  const { decimal, tokenSymbol } = config;
  let title, tokenValue;

  const numberFormatter = new Intl.NumberFormat('en-US');

  const getRoundUpValue = (value) => {
    if (value > 1000000000) {
      return `${numberFormatter.format(round(Big(value).div(1000000000).toNumber(), 2))}b`
    }
    if (value > 1000000) {
      return `${numberFormatter.format(round(Big(value).div(1000000).toNumber(), 2))}m`
    }
    if (value > 1000) {
      return `${numberFormatter.format(round(Big(value).div(1000).toNumber(), 2))}k`
    }
    return numberFormatter.format(value);
  }

  $: {
    tokenValue = Big(value||0).div(10 ** decimal).toNumber();
    const tokenValueText = isPrecise ? tokenValue : getRoundUpValue(tokenValue);
    title = !allowZero && tokenValue == 0 ? emptyDisplay : tokenValueText + (addSymbol ? ` ${tokenSymbol}` : '');
  } 

</script>

<div class="inline-block" title={numberFormatter.format(tokenValue)}>{title}</div>