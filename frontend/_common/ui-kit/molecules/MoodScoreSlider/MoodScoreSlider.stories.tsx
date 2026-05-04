import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MoodScoreSlider from './MoodScoreSlider';

const meta: Meta<typeof MoodScoreSlider> = {
  title: 'Molecules/MoodScoreSlider',
  component: MoodScoreSlider,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type MoodScoreSliderStory = StoryObj<typeof MoodScoreSlider>;

export const Default: MoodScoreSliderStory = {
  args: {
    value: 5,
    onChange: () => {},
    label: 'How are you feeling?',
  },
};

export const LowMood: MoodScoreSliderStory = {
  args: {
    value: 2,
    onChange: () => {},
    label: 'Current mood',
  },
};

export const HighMood: MoodScoreSliderStory = {
  args: {
    value: 9,
    onChange: () => {},
    label: 'Current mood',
  },
};

export const WithError: MoodScoreSliderStory = {
  args: {
    value: 5,
    onChange: () => {},
    label: 'Mood score',
    errorMessage: 'This field is required',
  },
};

export const Interactive: MoodScoreSliderStory = {
  render: () => {
    const [value, setValue] = useState(5);
    return <MoodScoreSlider value={value} onChange={setValue} label="Your mood" />;
  },
};
