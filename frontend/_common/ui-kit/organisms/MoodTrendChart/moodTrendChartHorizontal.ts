import * as d3 from 'd3';

import type { MoodTrendDatum } from '../../../utils';

import type { MoodTrendChartRangeKind } from './moodTrendChartTypes';

export const moodTrendVerticalAnnotations = [
  { moodScore: 10, label: 'Mania' },
  { moodScore: 7.5, label: 'Hypo-Mania' },
  { moodScore: 5, label: '' },
  { moodScore: 2.5, label: 'Minor Depression' },
  { moodScore: 0, label: 'Major Depression' },
] as const;

export function resolveHorizontalDomain(
  rangeKind: MoodTrendChartRangeKind,
  moodTrendData: MoodTrendDatum[],
): [number, number] {
  if (rangeKind === 'month') {
    return [
      moodTrendData[0].domainPosition - 0.45,
      moodTrendData[moodTrendData.length - 1].domainPosition + 0.45,
    ];
  }

  if (rangeKind === 'year') {
    return [-0.35, 11.35];
  }

  return [-0.35, 23.35];
}

export function resolveHorizontalTickValues(
  rangeKind: MoodTrendChartRangeKind,
  moodTrendData: MoodTrendDatum[],
): number[] {
  const totalDayCount = moodTrendData.length;

  if (rangeKind === 'month') {
    return moodTrendData
      .map((datum) => datum.domainPosition)
      .filter((dayNumber) => {
        if (dayNumber === 1 || dayNumber === totalDayCount) {
          return true;
        }

        const tickStride =
          totalDayCount > 24 ? 7 : totalDayCount > 14 ? 5 : totalDayCount > 7 ? 3 : 2;

        return dayNumber % tickStride === 0;
      });
  }

  if (rangeKind === 'year') {
    return d3.range(0, 12);
  }

  return d3.range(0, 24).filter(
    (hourOfDay) => hourOfDay === 0 || hourOfDay === 23 || hourOfDay % 4 === 0,
  );
}
