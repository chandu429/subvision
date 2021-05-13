import { readable, writable } from 'svelte/store';

export const time = readable(null, function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

export const curAuction = writable(null);
export const chronicle = writable(null);
