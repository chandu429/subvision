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
  value > 1 ? `${value} ${value != 1 ? name + 's' : name}` : '';

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

  return units.map(getTimeUnitInWord).join(' ');
};

export const getDateFromBlockNum = (blockNum: number, curBlockNum: number, timestamp?: string) => {
  const diff = blockNum - curBlockNum;
  const timeDiff = diff * 6000;
  const date = timestamp ? new Date(timestamp) : new Date();
  return formatter.format(new Date(date.getTime() + timeDiff)).replace(',', ' ');
};

export const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: false,
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit'
});

export const getColSpan = (allSlots: number[], curSlots: number[]): number[] => {
  console.log({ allSlots, curSlots });
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

  console.log({ occupied });
  const span = occupied.filter((val) => !!val).reduce((all, cur) => all + cur, 0);
  const startIdx = occupied.findIndex((val) => !!val);
  console.log({ startIdx }, span);
  const result = occupied.slice(0, startIdx).concat(
    span,
    times(allSlots.length - startIdx - span, () => 0)
  );
  console.log(result);
  return result;
};
