import { test } from 'vitest';

// Import Helper Functions
import parsePoints from '../src/helpers/parsePoints';
import parseScale from '../src/helpers/parseScale';
import parseCode from '../src/helpers/parseCode';
import parseArea from '../src/helpers/parseArea';

// Import Message Functions
import {
  createMessage,
  createTsunamiMessage,
} from '../src/helpers/messageCreator';

const exampleData = {
  code: 551,
  earthquake: {
    domesticTsunami: 'None',
    foreignTsunami: 'Unknown',
    hypocenter: {
      depth: 10,
      latitude: 32.6,
      longitude: 130.7,
      magnitude: 3.5,
      name: '熊本県熊本地方',
    },
    maxScale: 30,
    time: '2024/08/10 14:18:00',
  },
  id: '66b6f8d8d616be440743d3bf',
  issue: {
    correct: 'None',
    source: '気象庁',
    time: '2024/08/10 14:21:28',
    type: 'DetailScale',
  },
  points: [
    {
      addr: '宇城市豊野町',
      isArea: false,
      pref: '熊本県',
      scale: 30,
    },
    {
      addr: '宇城市松橋町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '宇城市不知火町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '宇城市小川町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '熊本西区春日',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '熊本南区富合町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '熊本南区城南町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '八代市千丁町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '八代市鏡町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '八代市泉支所',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '八代市平山新町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '八代市泉町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '八代市新地町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '八代市東陽町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '八代市坂本町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '宇土市浦田町',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '熊本美里町馬場',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '熊本美里町永富',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '西原村小森',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '御船町御船',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '嘉島町上島',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '甲佐町豊内',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '氷川町島地',
      isArea: false,
      pref: '熊本県',
      scale: 20,
    },
    {
      addr: '氷川町宮原',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '熊本中央区大江',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '熊本東区佐土原',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '熊本北区植木町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '菊池市旭志',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '大津町大津',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '益城町宮園',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '山都町浜町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '熊本高森町高森',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '五木村甲',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '上天草市大矢野町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '上天草市松島町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '上天草市姫戸町',
      isArea: false,
      pref: '熊本県',
      scale: 10,
    },
    {
      addr: '大牟田市昭和町',
      isArea: false,
      pref: '福岡県',
      scale: 10,
    },
    {
      addr: '雲仙市小浜町雲仙',
      isArea: false,
      pref: '長崎県',
      scale: 10,
    },
    {
      addr: '雲仙市雲仙出張所',
      isArea: false,
      pref: '長崎県',
      scale: 10,
    },
    {
      addr: '南島原市北有馬町',
      isArea: false,
      pref: '長崎県',
      scale: 10,
    },
    {
      addr: '延岡市北方町総合支所',
      isArea: false,
      pref: '宮崎県',
      scale: 10,
    },
    {
      addr: '椎葉村総合運動公園',
      isArea: false,
      pref: '宮崎県',
      scale: 10,
    },
    {
      addr: '椎葉村下福良',
      isArea: false,
      pref: '宮崎県',
      scale: 10,
    },
    {
      addr: '宮崎美郷町田代',
      isArea: false,
      pref: '宮崎県',
      scale: 10,
    },
    {
      addr: '高千穂町三田井',
      isArea: false,
      pref: '宮崎県',
      scale: 10,
    },
  ],
  time: '2024/08/10 14:21:28.898',
  timestamp: {
    convert: '2024/08/10 14:21:28.895',
    register: '2024/08/10 14:21:28.899',
  },
  user_agent: 'jmaxml-seis-parser-go, relay, register-api',
  ver: '20231023',
};

test('message', async ({ expect }) => {
  const earthQuakeInfo = parseCode(exampleData.code);
  const points = parsePoints(exampleData.points);
  const earthQuake = exampleData.earthquake;
  const time = earthQuake.time;
  const maxScale = earthQuake.maxScale;
  const parsedScale = parseScale(maxScale);

  if (parsedScale !== undefined) {
    const message = createMessage(
      time,
      earthQuakeInfo,
      parsedScale,
      points,
      false,
    );

    // Expected Messages
    const expectedMessage = `2024/08/10 14:18:00 Earthquake Information\nMaximum Seismic Intensity 3\n\n[Seismic Intensity 1] Fukuoka, Nagasaki, Miyazaki\n[Seismic Intensity 3] Kumamoto\n#evacuate`;

    expect(message).toBe(expectedMessage);
  }
});

const exampleTsunamiData = {
  areas: [
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
  ],
  cancelled: false,
  code: 552,
  id: '66b4792ad616be440743d393',
  issue: {
    source: '気象庁',
    time: '2024/08/08 16:52:09',
    type: 'Focus',
  },
  time: '2024/08/08 16:52:10.336',
  timestamp: {
    convert: '2024/08/08 16:52:10.332',
    register: '2024/08/08 16:52:10.336',
  },
  user_agent: 'jmaxml-seis-parser-go, relay, register-api',
  ver: '20231023',
};

test('tsunami message', async ({ expect }) => {
  const info = parseCode(exampleTsunamiData.code);
  const area = parseArea(exampleTsunamiData.areas);
  const areaResult: string = area.join(', ');
  const time = exampleTsunamiData.time.replace(/\.\d+$/, '');

  const message = createTsunamiMessage(time, info, areaResult, false);

  // Expected Messages
  const expectedMessage = `2024/08/08 16:52:10 Tsunami Information\nThere is new information in the following areas\n\nEhime, Kochi, Oita, Miyazaki, Kagoshima\n#evacuate`;

  expect(message).toBe(expectedMessage);
});
