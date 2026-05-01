import type { Meta, StoryObj } from '@storybook/react';
import LoadingSpinner from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Atoms/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    themeName: { control: 'select', options: ['calmLight', 'calmDark'] },
  },
};

export default meta;
type LoadingSpinnerStory = StoryObj<typeof LoadingSpinner>;

export const Default: LoadingSpinnerStory = { args: { size: 'medium', label: 'Loading', themeName: 'calmLight' } };
export const SmallDark: LoadingSpinnerStory = { args: { size: 'small', label: 'Please wait', themeName: 'calmDark' } };
export const LargeLight: LoadingSpinnerStory = { args: { size: 'large', label: 'Fetching data', themeName: 'calmLight' } };
