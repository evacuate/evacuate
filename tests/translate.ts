import { test } from 'vitest';
import translate from '~/translate';
import { Language, MessageKey, Prefecture } from '~/types/translate';

test('prefecture - Tokyo translations', ({ expect }) => {
  expect(translate('prefecture', Prefecture.TOKYO, Language.JA)).toBe('東京都');
  expect(translate('prefecture', Prefecture.TOKYO, Language.EN)).toBe('Tokyo');
  expect(translate('prefecture', Prefecture.TOKYO)).toBe('Tokyo');
});

test('prefecture - Osaka translations', ({ expect }) => {
  expect(translate('prefecture', Prefecture.OSAKA, Language.JA)).toBe('大阪府');
  expect(translate('prefecture', Prefecture.OSAKA, Language.EN)).toBe('Osaka');
  expect(translate('prefecture', Prefecture.OSAKA)).toBe('Osaka');
});

test('message - earthquakeInfo translations', ({ expect }) => {
  expect(translate('message', MessageKey.EARTHQUAKE_INFO, Language.JA)).toBe(
    '地震情報',
  );
  expect(translate('message', MessageKey.EARTHQUAKE_INFO, Language.EN)).toBe(
    'Earthquake Information',
  );
  expect(translate('message', MessageKey.EARTHQUAKE_INFO)).toBe(
    'Earthquake Information',
  );
});

test('message - maxSeismicIntensity translations', ({ expect }) => {
  expect(
    translate('message', MessageKey.MAX_SEISMIC_INTENSITY, Language.JA),
  ).toBe('最大震度');
  expect(
    translate('message', MessageKey.MAX_SEISMIC_INTENSITY, Language.EN),
  ).toBe('Maximum Seismic Intensity');
  expect(translate('message', MessageKey.MAX_SEISMIC_INTENSITY)).toBe(
    'Maximum Seismic Intensity',
  );
});

test('Code - Earthquake Information translations', ({ expect }) => {
  expect(translate('code', 551, Language.JA)).toBe('地震情報');
  expect(translate('code', 551, Language.EN)).toBe('Earthquake Information');
  expect(translate('code', 551)).toBe('Earthquake Information');
});

test('Code - Tsunami Information translations', ({ expect }) => {
  expect(translate('code', 552, Language.JA)).toBe('津波情報');
  expect(translate('code', 552, Language.EN)).toBe('Tsunami Information');
  expect(translate('code', 552)).toBe('Tsunami Information');
});

test('Code - Earthquake Early Warning Detected translations', ({ expect }) => {
  expect(translate('code', 554, Language.JA)).toBe('緊急地震速報（予報）');
  expect(translate('code', 554, Language.EN)).toBe(
    'Earthquake Early Warning Detected',
  );
  expect(translate('code', 554)).toBe('Earthquake Early Warning Detected');
});

test('Code - Earthquake Early Warning (Alert) translations', ({ expect }) => {
  expect(translate('code', 556, Language.JA)).toBe('緊急地震速報（警報）');
  expect(translate('code', 556, Language.EN)).toBe(
    'Earthquake Early Warning (Alert)',
  );
  expect(translate('code', 556)).toBe('Earthquake Early Warning (Alert)');
});

test('Code - Earthquake Detection Information translations', ({ expect }) => {
  expect(translate('code', 561, Language.JA)).toBe('地震検知情報');
  expect(translate('code', 561, Language.EN)).toBe(
    'Earthquake Detection Information',
  );
  expect(translate('code', 561)).toBe('Earthquake Detection Information');
});

test('Code - Earthquake Detection Analysis Results translations', ({
  expect,
}) => {
  expect(translate('code', 9611, Language.JA)).toBe('地震検知解析結果');
  expect(translate('code', 9611, Language.EN)).toBe(
    'Earthquake Detection Analysis Results',
  );
  expect(translate('code', 9611)).toBe('Earthquake Detection Analysis Results');
});
