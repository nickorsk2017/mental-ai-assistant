import type { Meta, StoryObj } from '@storybook/react';
import MoodAnalysisWorkspace from './MoodAnalysisWorkspace';

const meta: Meta<typeof MoodAnalysisWorkspace> = {
  title: 'Organisms/MoodAnalysisWorkspace',
  component: MoodAnalysisWorkspace,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type MoodAnalysisWorkspaceStory = StoryObj<typeof MoodAnalysisWorkspace>;

export const Default: MoodAnalysisWorkspaceStory = {
  args: {
    showHeading: true,
  },
};

export const WithoutHeading: MoodAnalysisWorkspaceStory = {
  args: {
    showHeading: false,
  },
};

export const WithCustomClassName: MoodAnalysisWorkspaceStory = {
  args: {
    showHeading: true,
    className: 'rounded-lg border border-calm-border',
  },
};
