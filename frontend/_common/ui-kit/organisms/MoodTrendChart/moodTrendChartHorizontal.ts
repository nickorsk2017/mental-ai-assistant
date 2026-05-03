import * as d3 from 'd3';

import type { MoodTrendDatum } from '../../../utils';

import type { MoodTrendChartRangeKind } from './moodTrendChartTypes';

/** Patient notes store mood as integers 1–10; axis matches that domain (not 0–10). */
export const moodTrendScoreDomainMinimum = 1;
export const moodTrendScoreDomainMaximum = 10;

export function clampMoodScoreToChartDomain(rawMoodScore: number): number {
  return Math.min(
    moodTrendScoreDomainMaximum,
    Math.max(moodTrendScoreDomainMinimum, rawMoodScore),
  );
}

/** Prepends (firstTime, mood 1) so the stroke shares the area’s bottom-left corner before the first sample. */
export function buildMoodLineStrokeSeries(moodTrendDataWithScores: MoodTrendDatum[]): MoodTrendDatum[] {
  if (moodTrendDataWithScores.length === 0) {
    return [];
  }

  const firstDatum = moodTrendDataWithScores[0];
  const firstMoodScore = clampMoodScoreToChartDomain(firstDatum.averageMoodScore!);

  if (firstMoodScore <= moodTrendScoreDomainMinimum) {
    return moodTrendDataWithScores;
  }

  const floorAnchorDatum: MoodTrendDatum = {
    domainPosition: firstDatum.domainPosition,
    tickLabel: firstDatum.tickLabel,
    averageMoodScore: moodTrendScoreDomainMinimum,
  };

  return [floorAnchorDatum, ...moodTrendDataWithScores];
}

/**
 * Five reference levels on the 1–10 score line: endpoints 1 and 10, three equal steps between
 * (same geometry as a 0–10 scale linearly mapped to 1–10).
 */
export const moodTrendVerticalAnnotations = [
  { moodScore: 10, label: 'Mania' },
  { moodScore: 7.75, label: 'Hypo-Mania' },
  { moodScore: 5.5, label: '' },
  { moodScore: 3.25, label: 'Minor Depression' },
  { moodScore: 1, label: 'Major Depression' },
] as const;

export const moodTrendNeutralMoodScore = 5.5;

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
