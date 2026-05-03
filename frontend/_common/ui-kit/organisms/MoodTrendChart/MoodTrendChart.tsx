'use client';

import * as d3 from 'd3';
import React, { useEffect, useId, useRef } from 'react';

import type { MoodTrendDatum } from '../../../utils';

import {
  moodTrendVerticalAnnotations,
  resolveHorizontalDomain,
  resolveHorizontalTickValues,
} from './moodTrendChartHorizontal';
import type { MoodTrendChartRangeKind } from './moodTrendChartTypes';

export type { MoodTrendChartRangeKind };

interface MoodTrendChartProperties {
  chartHeightPixels: number;
  chartWidthPixels: number;
  moodTrendData: MoodTrendDatum[];
  rangeKind: MoodTrendChartRangeKind;
}

const moodScoreMinimum = 0;
const moodScoreMaximum = 10;

export default React.memo(function MoodTrendChart({
  chartHeightPixels,
  chartWidthPixels,
  moodTrendData,
  rangeKind,
}: MoodTrendChartProperties) {
  const svgReference = useRef<SVGSVGElement>(null);
  const descriptionIdentifier = useId();

  useEffect(() => {
    const svgElement = svgReference.current;

    if (!svgElement || chartWidthPixels <= 0 || moodTrendData.length === 0) {
      return;
    }

    const margin = { top: 20, right: 28, bottom: 44, left: 96 };
    const innerWidth = chartWidthPixels - margin.left - margin.right;
    const innerHeight = chartHeightPixels - margin.top - margin.bottom;

    const svgSelection = d3.select(svgElement);

    svgSelection.selectAll('*').remove();

    const [horizontalDomainMinimum, horizontalDomainMaximum] = resolveHorizontalDomain(
      rangeKind,
      moodTrendData,
    );

    const horizontalScale = d3
      .scaleLinear()
      .domain([horizontalDomainMinimum, horizontalDomainMaximum])
      .range([0, innerWidth]);

    const verticalScale = d3
      .scaleLinear()
      .domain([moodScoreMinimum, moodScoreMaximum])
      .range([innerHeight, 0]);

    const chartGroup = svgSelection
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    chartGroup
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', verticalScale(5))
      .attr('y2', verticalScale(5))
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 1.25)
      .attr('class', 'text-calm-text opacity-90');

    moodTrendVerticalAnnotations.forEach((annotation) => {
      if (annotation.moodScore === 5) {
        return;
      }

      chartGroup
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', verticalScale(annotation.moodScore))
        .attr('y2', verticalScale(annotation.moodScore))
        .attr('stroke', 'currentColor')
        .attr('stroke-dasharray', '4 6')
        .attr('class', 'text-calm-border opacity-70');

      chartGroup
        .append('text')
        .attr('x', -10)
        .attr('y', verticalScale(annotation.moodScore))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('class', 'fill-calm-muted text-[11px]')
        .text(annotation.label);
    });

    const horizontalTickValues = resolveHorizontalTickValues(rangeKind, moodTrendData);

    const horizontalAxis = d3
      .axisBottom(horizontalScale)
      .tickValues(horizontalTickValues)
      .tickFormat((value) => {
        const numericValue = Number(value);

        if (rangeKind === 'year' || rangeKind === 'hours') {
          return moodTrendData.find((datum) => datum.domainPosition === numericValue)?.tickLabel ?? '';
        }

        return String(value);
      });

    chartGroup
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(horizontalAxis)
      .attr('class', 'text-calm-muted [&_path]:stroke-calm-border [&_line]:stroke-calm-border')
      .selectAll('text')
      .attr('class', 'text-[11px]');

    const moodTrendDataWithScores = moodTrendData.filter(
      (datum) => datum.averageMoodScore !== null,
    );

    const moodLineBuilder = d3
      .line<MoodTrendDatum>()
      .curve(d3.curveMonotoneX)
      .x((datum) => horizontalScale(datum.domainPosition))
      .y((datum) => verticalScale(datum.averageMoodScore!));

    if (moodTrendDataWithScores.length >= 2) {
      chartGroup
        .append('path')
        .datum(moodTrendDataWithScores)
        .attr('fill', 'none')
        .attr('stroke-width', 2.25)
        .attr('d', moodLineBuilder)
        .attr('class', 'stroke-calm-second');
    }

    chartGroup
      .selectAll('circle.data-point')
      .data(moodTrendDataWithScores)
      .join('circle')
      .attr('class', 'data-point fill-calm-second stroke-calm-surface')
      .attr('r', 4)
      .attr('cx', (datum) => horizontalScale(datum.domainPosition))
      .attr('cy', (datum) => verticalScale(datum.averageMoodScore!))
      .attr('stroke-width', 1.5);
  }, [chartHeightPixels, chartWidthPixels, moodTrendData, rangeKind]);

  return (
    <svg
      ref={svgReference}
      role="img"
      aria-describedby={descriptionIdentifier}
      width={chartWidthPixels}
      height={chartHeightPixels}
      className="max-w-full text-calm-text"
    >
      <title>Mood trend chart</title>
      <desc id={descriptionIdentifier}>
        Line chart of average mood scores over the selected time range.
      </desc>
    </svg>
  );
});
