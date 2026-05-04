import type { Meta, StoryObj } from '@storybook/react';
import MoodTrendChart from './MoodTrendChart';
import type { MoodTrendDatum } from '../../../utils';

const meta: Meta<typeof MoodTrendChart> = {
  title: 'Organisms/MoodTrendChart',
  component: MoodTrendChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type MoodTrendChartStory = StoryObj<typeof MoodTrendChart>;

const mockMonthData: MoodTrendDatum[] = Array.from({ length: 30 }, (_, i) => ({
  domainPosition: i + 1,
  tickLabel: `Day ${i + 1}`,
  averageMoodScore: 5 + Math.sin(i * 0.2) * 3,
}));

const mockYearData: MoodTrendDatum[] = Array.from({ length: 12 }, (_, i) => ({
  domainPosition: i + 1,
  tickLabel: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  averageMoodScore: 4 + Math.sin(i * 0.5) * 2.5,
}));

export const MonthView: MoodTrendChartStory = {
  args: {
    chartHeightPixels: 340,
    chartWidthPixels: 640,
    moodTrendData: mockMonthData,
    rangeKind: 'month',
  },
};

export const YearView: MoodTrendChartStory = {
  args: {
    chartHeightPixels: 340,
    chartWidthPixels: 640,
    moodTrendData: mockYearData,
    rangeKind: 'year',
  },
};

export const CompactWidth: MoodTrendChartStory = {
  args: {
    chartHeightPixels: 340,
    chartWidthPixels: 400,
    moodTrendData: mockMonthData,
    rangeKind: 'month',
  },
};

export const EmptyData: MoodTrendChartStory = {
  args: {
    chartHeightPixels: 340,
    chartWidthPixels: 640,
    moodTrendData: [],
    rangeKind: 'month',
  },
};
