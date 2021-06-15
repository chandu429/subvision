import { times } from 'lodash-es';

export const normalize = (node: any) => {
  if (Array.isArray(node)) {
    return node.map(normalize);
  }

  if (typeof node === 'object') {
    return Object.entries(node).reduce((prev, [key, val]) => {
      if (typeof val == 'object' && Array.isArray(val?.['nodes'])) {
        return {
          ...prev,
          [key]: normalize(val['nodes']),
          [key + 'PageInfo']: val['pageInfo'],
          [key + 'Total']: val['totalCount']
        };
      }
      if (Array.isArray(val)) {
        return { ...prev, [key]: normalize(val) };
      }
      if (key === '__typename') {
        return prev;
      }
      return { ...prev, [key]: val };
    }, {});
  }
  return node;
};

interface Slot {
  start: number;
  end: number;
}

export const getSlotsCombination = (first: number, last: number): Slot[] => {
  const length = last - first + 1;
  return times(length, (idx) => times(length - idx, (n) => ({ start: first + idx, end: last - n }))).flat();
};

const getTimeUnitInWord = ({ value, name }: { value: number; name: string }) =>
  value > 0 ? `${value} ${value != 1 ? name + 's' : name}` : '';

export const getTimeDiffInWord = (timeDeltaMs: number): string => {
  const timeUnits = [
    { value: 86400000, name: 'day' },
    { value: 3600000, name: 'hour' },
    { value: 60000, name: 'min' },
    { value: 1000, name: 'sec' }
  ];

  const { units } = timeUnits.reduce(
    ({ remain, units }, unit) => {
      const { value, name } = unit;
      const curUnitValue = Math.floor(remain / value);
      return { remain: remain % value, units: units.concat({ name, value: curUnitValue }) };
    },
    { remain: timeDeltaMs, units: [] }
  );
  const result = units.map(getTimeUnitInWord).join(' ');
  return result;
};

export const getDateFromBlockNum = (blockNum: number, curBlockNum: number, timestamp?: string, displayTime?: false) => {
  const diff = blockNum - curBlockNum;
  const timeDiff = diff * 6000;
  const date = timestamp ? new Date(timestamp) : new Date();
  const formatter = displayTime ? dateTimeFormatter : dateFormatter;
  return formatter.format(new Date(date.getTime() + timeDiff)).replace(',', ' ');
};

export const dateFormatter = new Intl.DateTimeFormat('en-US');
export const dateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: false,
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit'
});

export const getColSpan = (allSlots: number[], curSlots: number[]): number[] => {
  const { result: occupied } = allSlots.reduce(
    ({ result, idx }, cur) => {
      if (cur === curSlots[idx]) {
        return {
          result: result.concat(1),
          idx: idx + 1
        };
      }
      return {
        result: result.concat(0),
        idx
      };
    },
    { result: [], idx: 0 }
  );

  const span = occupied.filter((val) => !!val).reduce((all, cur) => all + cur, 0);
  const startIdx = occupied.findIndex((val) => !!val);
  const result = occupied.slice(0, startIdx).concat(
    span,
    times(allSlots.length - startIdx - span, () => 0)
  );
  return result;
};

interface Lease {
  [key: string]: any;
  firstLease: number;
  lastLease: number;
}

interface GroupedLeaseSeries {
  starts: number;
  ends: number;
  totalBidAmount: number;
  totalLockupValue: number;
  series: Lease[];
  winningChance: number;
}

const findContinuation = (cur: Lease, segments: Lease[], prev: Lease[] = []): Lease[][] => {
  const next = cur.lastLease + 1;
  return segments.reduce((current, { firstLease, lastLease, ...others }, idx) => {
    if (next === firstLease) {
      const curBranch = prev.concat({ firstLease, lastLease, ...others });
      current.push(curBranch);
      const rest = [...segments.slice(0, idx), ...segments.slice(idx + 1)];

      if (rest.length) {
        current.push(...findContinuation({ firstLease, lastLease }, rest, curBranch));
      }
    }
    return current;
  }, [] as Lease[][]);
};

export const gatherCombination = (sortedLease: Lease[]): GroupedLeaseSeries[] => {
  return sortedLease.reduce((all, lease) => {
    const result = findContinuation(lease, sortedLease, [lease]);
    const group = [...result, [lease]].map((series) => ({
      starts: series[0].firstLease,
      ends: series[series.length - 1].lastLease,
      totalBidAmount: series.reduce((total, { latestBidAmount }) => {
        return total + (latestBidAmount ? parseInt(latestBidAmount, 10) : 0);
      }, 0),
      totalLockupValue: series.reduce((total, { latestBidAmount, firstLease, lastLease }) => {
        return total + (lastLease - firstLease + 1) * (latestBidAmount ? parseInt(latestBidAmount, 10) : 0);
      }, 0),
      winningChance: series.reduce((total, { leadingRate }) => total * (leadingRate ? parseFloat(leadingRate) : 0), 1),
      series
    }));
    return all.concat(group);
  }, [] as GroupedLeaseSeries[]);
};
