import type { Config } from 'tailwindcss';
import { softCalmTheme, tailwindBoxShadowTokens } from '../_common/themes/calm-theme';

const calmColorPalette = {
  primary: softCalmTheme.colors.primary,
  black: softCalmTheme.colors.black,
  'black-soft': softCalmTheme.colors.blackSoft,
  'black-soft-deep': softCalmTheme.colors.blackSoftDeep,
  second: "rgb(228 138 58 / <alpha-value>)",
  "second/18": "rgb(228 138 58 / 0.18)",
  'primary-text': softCalmTheme.colors.primaryText,
  background: softCalmTheme.colors.mutedSurface,
  surface: softCalmTheme.colors.surface,
  "surface/20": "rgb(255 255 255 / 0.2)",
  text: softCalmTheme.colors.textPrimary,
  muted: softCalmTheme.colors.textSecondary,
  border: softCalmTheme.colors.border,
  error: softCalmTheme.colors.danger,
  label: softCalmTheme.colors.label,
  "black-soft/45": "rgb(73 79 103 / 0.45)",
  "border/50": "rgb(122 131 153 / 0.5)",
  mood: {
    depression: softCalmTheme.colors.moodDepression,
    'depression-surface': softCalmTheme.colors.moodDepressionSurface,
    normal: softCalmTheme.colors.moodNormal,
    'normal-deep': softCalmTheme.colors.moodNormalDeep,
    'normal-surface': softCalmTheme.colors.moodNormalSurface,
    euphoria: softCalmTheme.colors.moodEuphoria,
    'euphoria-surface': softCalmTheme.colors.moodEuphoriaSurface,
  },
} as const;

const tailwindConfiguration: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../_common/hooks/**/*.{ts,tsx}',
    '../_common/ui-kit/**/*.{ts,tsx}',
  ],
  safelist: [
    'bg-calm-primary/18',
    'border-calm-border',
    'border-calm-primary',
    'focus-visible:border-calm-primary',
    'focus-visible:ring-2',
    'focus-visible:ring-calm-primary/20',
    'ring-2',
    'ring-calm-primary/20',
  ],
  theme: {
    extend: {
      colors: {
        calm: calmColorPalette,
      },
      boxShadow: tailwindBoxShadowTokens
    },
  },
  plugins: [],
};

export default tailwindConfiguration;
