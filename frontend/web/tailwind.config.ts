import type { Config } from 'tailwindcss';
import { softCalmTheme, tailwindBoxShadowTokens, tailwindFontSizeTokens } from '../_common/themes/calm-theme';

const calmColorPalette = {
  primary: softCalmTheme.colors.primary,
  second: "rgb(228 138 58 / <alpha-value>)",
  'primary-text': softCalmTheme.colors.primaryText,
  background: softCalmTheme.colors.mutedSurface,
  surface: softCalmTheme.colors.surface,
  text: softCalmTheme.colors.textPrimary,
  muted: softCalmTheme.colors.textSecondary,
  border: softCalmTheme.colors.border,
  error: softCalmTheme.colors.danger,
  label: softCalmTheme.colors.label,
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
