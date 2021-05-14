export const normalize = (node: any) => {
  if (Array.isArray(node)) {
    return node.map(normalize);
  }

  if (typeof node === 'object') {
    return Object.entries(node).reduce((prev, [key, val]) => {
      if (typeof val == 'object' && Array.isArray(val?.['nodes'])) {
        return { ...prev, [key]: normalize(val['nodes']) };
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

export const getSlotsCombination = (start: number): Slot[] => {
  return [
    // 0 - 3
    { start, end: start + 3 },
    // 0 - 2
    { start, end: start + 2 },
    // 1 - 3
    { start: start + 1, end: start + 3 },
    // 0 - 1
    { start, end: start + 1 },
    // 1 - 2
    { start: start + 1, end: start + 2 },
    // 2 - 3
    { start: start + 2, end: start + 3 },
    // 0, 1, 2, 3
    { start, end: start },
    { start: start + 1, end: start + 1 },
    { start: start + 2, end: start + 2 },
    { start: start + 3, end: start + 3 }
  ];
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
  const result = occupied.slice(0, startIdx).concat(span);
  // console.log(allSlots, curSlots, result);
  return result;
};
