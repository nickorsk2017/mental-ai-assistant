import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import MoodTrendChart from './MoodTrendChart';
import type { MoodTrendDatum } from '../../../utils';

describe('MoodTrendChart', () => {
  const mockMoodData: MoodTrendDatum[] = [
    { domainPosition: 1, tickLabel: 'Day 1', averageMoodScore: 5 },
    { domainPosition: 2, tickLabel: 'Day 2', averageMoodScore: 6 },
    { domainPosition: 3, tickLabel: 'Day 3', averageMoodScore: 7 },
  ];

  it('renders SVG element with proper role and title', () => {
    const { container } = render(
      <MoodTrendChart
        chartHeightPixels={340}
        chartWidthPixels={640}
        moodTrendData={mockMoodData}
        rangeKind="month"
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.querySelector('title')).toBeTruthy();
  });

  it('renders without crashing on empty data', () => {
    const { container } = render(
      <MoodTrendChart
        chartHeightPixels={340}
        chartWidthPixels={640}
        moodTrendData={[]}
        rangeKind="month"
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders without crashing with data lacking mood scores', () => {
    const dataWithoutScores: MoodTrendDatum[] = [
      { domainPosition: 1, tickLabel: 'Day 1', averageMoodScore: null },
    ];

    const { container } = render(
      <MoodTrendChart
        chartHeightPixels={340}
        chartWidthPixels={640}
        moodTrendData={dataWithoutScores}
        rangeKind="month"
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
