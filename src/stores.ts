import { readable, writable, derived } from 'svelte/store';
import { formatter } from './utils';

export const timeStr = readable(null, function start(set) {
  const interval = setInterval(() => {
    set(formatter.format(new Date()));
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

export const curAuction = writable(null);
export const chronicle = writable(null);

export const lastBlockNum = derived(chronicle, ($chronicle) => $chronicle?.curBlockNum || 0);
export const lastBlockTime = derived(chronicle, ($chronicle) => $chronicle?.updatedAt);
