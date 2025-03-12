export enum Language {
  EN = 'en',
  JA = 'ja',
}

export enum Code {
  EARTHQUAKE_INFORMATION = 551,
  TSUNAMI_INFORMATION = 552,
  EARTHQUAKE_EARLY_WARNING_DETECTED = 554,
  EARTHQUAKE_EARLY_WARNING_ALERT = 556,
  EARTHQUAKE_DETECTION_INFORMATION = 561,
  EARTHQUAKE_DETECTION_ANALYSIS_RESULTS = 9611,
}

export enum MessageKey {
  TEST_DISTRIBUTION = 'testDistribution',
  TEST_DISTRIBUTION_SHORT = 'testDistributionShort',
  EARTHQUAKE_INFO = 'earthquakeInfo',
  MAX_SEISMIC_INTENSITY = 'maxSeismicIntensity',
  SEISMIC_INTENSITY = 'seismicIntensity',
  NEW_INFORMATION = 'newInformation',
  MAX_INTENSITY_RECEIVED = 'maxIntensityReceived',
}

export enum Prefecture {
  HOKKAIDO = 'hokkaido',
  AOMORI = 'aomori',
  IWATE = 'iwate',
  MIYAGI = 'miyagi',
  AKITA = 'akita',
  YAMAGATA = 'yamagata',
  FUKUSHIMA = 'fukushima',
  IBARAKI = 'ibaraki',
  TOCHIGI = 'tochigi',
  GUNMA = 'gunma',
  SAITAMA = 'saitama',
  CHIBA = 'chiba',
  TOKYO = 'tokyo',
  KANAGAWA = 'kanagawa',
  NIIGATA = 'niigata',
  TOYAMA = 'toyama',
  ISHIKAWA = 'ishikawa',
  FUKUI = 'fukui',
  YAMANASHI = 'yamanashi',
  NAGANO = 'nagano',
  GIFU = 'gifu',
  SHIZUOKA = 'shizuoka',
  AICHI = 'aichi',
  MIE = 'mie',
  SHIGA = 'shiga',
  KYOTO = 'kyoto',
  OSAKA = 'osaka',
  HYOGO = 'hyogo',
  NARA = 'nara',
  WAKAYAMA = 'wakayama',
  TOTTORI = 'tottori',
  SHIMANE = 'shimane',
  OKAYAMA = 'okayama',
  HIROSHIMA = 'hiroshima',
  YAMAGUCHI = 'yamaguchi',
  TOKUSHIMA = 'tokushima',
  KAGAWA = 'kagawa',
  EHIME = 'ehime',
  KOCHI = 'kochi',
  FUKUOKA = 'fukuoka',
  SAGA = 'saga',
  NAGASAKI = 'nagasaki',
  KUMAMOTO = 'kumamoto',
  OITA = 'oita',
  MIYAZAKI = 'miyazaki',
  KAGOSHIMA = 'kagoshima',
  OKINAWA = 'okinawa',
}

export interface Translations {
  code: Record<Code, string>;
  message: Record<MessageKey, string>;
  prefecture: Record<Prefecture, string>;
}

export default {} as Translations;
