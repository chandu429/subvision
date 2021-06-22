import { readable, writable, derived } from 'svelte/store';
import { dateTimeFormatter } from './utils';

export const timeStr = readable(null, function start(set) {
  const interval = setInterval(() => {
    set(dateTimeFormatter.format(new Date()).replace(',', ' '));
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

export const curAuction = writable(null);
export const chronicle = writable(null);

export const lastBlockNum = derived(chronicle, ($chronicle) => $chronicle?.curBlockNum || 0);
export const lastBlockTime = derived(chronicle, ($chronicle) => $chronicle?.updatedAt);
export const curLease = derived(chronicle, ($chronicle) => $chronicle?.curLease);
export const curLeaseStart = derived(chronicle, ($chronicle) => $chronicle?.curLeaseStart);
export const curLeaseEnd = derived(chronicle, ($chronicle) => $chronicle?.curLeaseEnd);

export const paraMappings = writable(null);
