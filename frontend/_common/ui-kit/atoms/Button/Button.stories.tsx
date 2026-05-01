import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type ButtonStory = StoryObj<typeof Button>;

export const Primary: ButtonStory = {
  args: {
    children: 'Sign In',
    onClick: () => undefined,
    variant: 'primary',
    size: 'medium',
  },
};

export const Secondary: ButtonStory = {
  args: {
    children: 'Create Account',
    onClick: () => undefined,
    variant: 'secondary',
    size: 'medium',
  },
};

export const Outline: ButtonStory = {
  args: {
    children: 'Continue with Google',
    onClick: () => undefined,
    variant: 'outline',
    size: 'medium',
  },
};

export const Ghost: ButtonStory = {
  args: {
    children: 'Cancel',
    onClick: () => undefined,
    variant: 'ghost',
    size: 'medium',
  },
};

export const Loading: ButtonStory = {
  args: {
    children: 'Sign In',
    onClick: () => undefined,
    variant: 'primary',
    isLoading: true,
  },
};

export const Disabled: ButtonStory = {
  args: {
    children: 'Sign In',
    onClick: () => undefined,
    variant: 'primary',
    disabled: true,
  },
};

export const SmallSize: ButtonStory = {
  args: {
    children: 'Dismiss',
    onClick: () => undefined,
    variant: 'ghost',
    size: 'small',
  },
};

export const LargeSize: ButtonStory = {
  args: {
    children: 'Get Started',
    onClick: () => undefined,
    variant: 'primary',
    size: 'large',
  },
};
