import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const iconNameOptions = [
  'mail',
  'lock',
  'eye',
  'eye-off',
  'google',
  'user',
  'check',
  'plus',
  'pencil',
  'trash',
  'x',
  'arrow-left',
  'calendar',
  'chevron-down',
] as const;

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    name: { control: 'select', options: iconNameOptions },
    size: { control: { type: 'number', min: 12, max: 96, step: 2 } },
    color: { control: 'color' },
  },
};

export default meta;
type IconStory = StoryObj<typeof Icon>;

export const Mail: IconStory = { args: { name: 'mail', size: 24 } };
export const Calendar: IconStory = { args: { name: 'calendar', size: 32 } };
export const GoogleFilled: IconStory = { args: { name: 'google', size: 28 } };
export const ColoredCheck: IconStory = { args: { name: 'check', size: 32, color: '#22c55e' } };

export const Gallery: IconStory = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {iconNameOptions.map((iconName) => (
        <div
          key={iconName}
          className="flex flex-col items-center justify-center gap-2 rounded-md bg-white p-3 shadow-sm"
        >
          <Icon name={iconName} size={28} />
          <span className="text-xs text-calm-muted">{iconName}</span>
        </div>
      ))}
    </div>
  ),
};
