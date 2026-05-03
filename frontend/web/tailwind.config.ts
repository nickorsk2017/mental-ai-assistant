import type { Config } from 'tailwindcss';
import { softCalmTheme, tailwindBoxShadowTokens, tailwindFontSizeTokens } from '../_common/themes/calm-theme';

const calmColorPalette = {
  primary: softCalmTheme.colors.primary,
  second: softCalmTheme.colors.second,
  black: softCalmTheme.colors.black,
  'black-soft': softCalmTheme.colors.blackSoft,
  'black-soft-deep': softCalmTheme.colors.blackSoftDeep,
  'primary-text': softCalmTheme.colors.primaryText,
  background: softCalmTheme.colors.mutedSurface,
  surface: softCalmTheme.colors.surface,
  text: softCalmTheme.colors.textPrimary,
  muted: softCalmTheme.colors.textSecondary,
  border: softCalmTheme.colors.border,
  error: softCalmTheme.colors.danger,
  label: softCalmTheme.colors.label,
  mood: {
    depression: softCalmTheme.colors.moodDepression,
    'depression-surface': softCalmTheme.colors.moodDepressionSurface,
    normal: softCalmTheme.colors.moodNormal,
    'normal-surface': softCalmTheme.colors.moodNormalSurface,
    euphoria: softCalmTheme.colors.moodEuphoria,
    'euphoria-surface': softCalmTheme.colors.moodEuphoriaSurface,
  },
} as const;

const tailwindConfiguration: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
    '../_common/hooks/**/*.{ts,tsx}',
    '../_common/ui-kit/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        calm: calmColorPalette,
      },
      boxShadow: tailwindBoxShadowTokens,
      fontSize: tailwindFontSizeTokens,
    },
  },
  plugins: [],
};

export default tailwindConfiguration;
