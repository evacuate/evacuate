import { test } from 'vitest';

// Import Helper Functions
import parseArea from '../src/helpers/parseArea';

const exampleData = [
  {
    firstHeight: {
      arrivalTime: '2024/08/08 17:10:00',
    },
    grade: 'Watch',
    immediate: false,
    maxHeight: {
      description: '１ｍ',
      value: 1,
    },
    name: '愛媛県宇和海沿岸',
  },
  {
    firstHeight: {
      condition: '津波到達中と推測',
    },
    grade: 'Watch',
    immediate: true,
    maxHeight: {
      description: '１ｍ',
      value: 1,
    },
    name: '高知県',
  },
  {
    firstHeight: {
      condition: '津波到達中と推測',
    },
    grade: 'Watch',
    immediate: true,
    maxHeight: {
      description: '１ｍ',
      value: 1,
    },
    name: '大分県豊後水道沿岸',
  },
  {
    firstHeight: {
      condition: '津波到達中と推測',
    },
    grade: 'Watch',
    immediate: true,
    maxHeight: {
      description: '１ｍ',
      value: 1,
    },
    name: '宮崎県',
  },
  {
    firstHeight: {
      condition: '津波到達中と推測',
    },
    grade: 'Watch',
    immediate: true,
    maxHeight: {
      description: '１ｍ',
      value: 1,
    },
    name: '鹿児島県東部',
  },
  {
    firstHeight: {
      arrivalTime: '2024/08/08 17:00:00',
      condition: 'ただちに津波来襲と予測',
    },
    grade: 'Watch',
    immediate: true,
    maxHeight: {
      description: '１ｍ',
      value: 1,
    },
    name: '種子島・屋久島地方',
  },
];

test('parseArea', async ({ expect }) => {
  const result = parseArea(exampleData);
  expect(result).toEqual(['Ehime', 'Kochi', 'Oita', 'Miyazaki', 'Kagoshima']);
});
