import type { Meta, StoryObj } from '@storybook/react';
import Collapse from './Collapse';

const meta: Meta<typeof Collapse> = {
  title: 'Molecules/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type CollapseStory = StoryObj<typeof Collapse>;

export const Default: CollapseStory = {
  args: {
    header: 'Click to expand',
    children: 'This is the collapsible content that toggles on click.',
    defaultOpen: false,
  },
};

export const DefaultOpen: CollapseStory = {
  args: {
    header: 'Expanded by default',
    children: 'This content is visible on initial render.',
    defaultOpen: true,
  },
};

export const WithLongContent: CollapseStory = {
  args: {
    header: 'Settings',
    children: (
      <div className="space-y-3 px-4 py-3">
        <p>Option 1</p>
        <p>Option 2</p>
        <p>Option 3</p>
      </div>
    ),
  },
};
