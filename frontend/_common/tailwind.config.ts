/**
 * Tailwind config used by Storybook (and any other tooling that previews
 * `@common/shared` components in isolation). It re-uses the same calm-theme
 * tokens that `frontend/web/tailwind.config.ts` consumes so that components
 * render identically inside Storybook and inside the host apps.
 */
import type { Config } from 'tailwindcss';
import {
  softCalmTheme,
  tailwindBoxShadowTokens,
  tailwindFontSizeTokens,
} from './themes/calm-theme';

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
    'normal-deep': softCalmTheme.colors.moodNormalDeep,
    'normal-surface': softCalmTheme.colors.moodNormalSurface,
    euphoria: softCalmTheme.colors.moodEuphoria,
    'euphoria-surface': softCalmTheme.colors.moodEuphoriaSurface,
  },
} as const;

const tailwindConfiguration: Config = {
  content: [
    './ui-kit/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
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
