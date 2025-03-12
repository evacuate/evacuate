import env from '~/env';
import translate from '~/translate';
import { Prefecture } from '~/types/translate';

interface Area {
  name?: string;
}

// Map of Japanese prefecture names to Prefecture enum values
export const prefectureMap: Record<string, Prefecture> = {
  北海道: Prefecture.HOKKAIDO,
  青森県: Prefecture.AOMORI,
  岩手県: Prefecture.IWATE,
  宮城県: Prefecture.MIYAGI,
  秋田県: Prefecture.AKITA,
  山形県: Prefecture.YAMAGATA,
  福島県: Prefecture.FUKUSHIMA,
  茨城県: Prefecture.IBARAKI,
  栃木県: Prefecture.TOCHIGI,
  群馬県: Prefecture.GUNMA,
  埼玉県: Prefecture.SAITAMA,
  千葉県: Prefecture.CHIBA,
  東京都: Prefecture.TOKYO,
  神奈川県: Prefecture.KANAGAWA,
  新潟県: Prefecture.NIIGATA,
  富山県: Prefecture.TOYAMA,
  石川県: Prefecture.ISHIKAWA,
  福井県: Prefecture.FUKUI,
  山梨県: Prefecture.YAMANASHI,
  長野県: Prefecture.NAGANO,
  岐阜県: Prefecture.GIFU,
  静岡県: Prefecture.SHIZUOKA,
  愛知県: Prefecture.AICHI,
  三重県: Prefecture.MIE,
  滋賀県: Prefecture.SHIGA,
  京都府: Prefecture.KYOTO,
  大阪府: Prefecture.OSAKA,
  兵庫県: Prefecture.HYOGO,
  奈良県: Prefecture.NARA,
  和歌山県: Prefecture.WAKAYAMA,
  鳥取県: Prefecture.TOTTORI,
  島根県: Prefecture.SHIMANE,
  岡山県: Prefecture.OKAYAMA,
  広島県: Prefecture.HIROSHIMA,
  山口県: Prefecture.YAMAGUCHI,
  徳島県: Prefecture.TOKUSHIMA,
  香川県: Prefecture.KAGAWA,
  愛媛県: Prefecture.EHIME,
  高知県: Prefecture.KOCHI,
  福岡県: Prefecture.FUKUOKA,
  佐賀県: Prefecture.SAGA,
  長崎県: Prefecture.NAGASAKI,
  熊本県: Prefecture.KUMAMOTO,
  大分県: Prefecture.OITA,
  宮崎県: Prefecture.MIYAZAKI,
  鹿児島県: Prefecture.KAGOSHIMA,
  沖縄県: Prefecture.OKINAWA,
};

export default function parseArea(area: Area[]): string[] {
  const areaNames = new Set<string>();

  for (const a of area) {
    if (!a.name) continue;

    for (const [jaName, prefEnum] of Object.entries(prefectureMap)) {
      if (a.name.includes(jaName)) {
        areaNames.add(translate('prefecture', prefEnum, env.LANGUAGE));
        break; // Once found, go to the next `Area`
      }
    }
  }

  return Array.from(areaNames);
}
