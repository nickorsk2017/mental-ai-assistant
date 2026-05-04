import type { Meta, StoryObj } from '@storybook/react';
import PanelPageHeader from './PanelPageHeader';

const meta: Meta<typeof PanelPageHeader> = {
  title: 'Molecules/PanelPageHeader',
  component: PanelPageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type PanelPageHeaderStory = StoryObj<typeof PanelPageHeader>;

export const TitleOnly: PanelPageHeaderStory = {
  args: {
    title: 'Journal Entries',
  },
};

export const WithAction: PanelPageHeaderStory = {
  args: {
    title: 'Messages',
    onPrimaryAction: () => alert('New message'),
    primaryActionAriaLabel: 'New message',
  },
};

export const LongTitle: PanelPageHeaderStory = {
  args: {
    title: 'This is a longer header title that might wrap or truncate depending on screen size',
    onPrimaryAction: () => {},
    primaryActionAriaLabel: 'Add new item',
  },
};
