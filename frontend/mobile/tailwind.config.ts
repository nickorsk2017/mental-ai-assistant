import type { Config } from 'tailwindcss';
import { softCalmTheme, tailwindBoxShadowTokens, tailwindFontSizeTokens } from '../_common/themes/calm-theme';

const calmColorPalette = {
  primary: softCalmTheme.colors.primary,
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
} as const;

const tailwindConfiguration: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../_common/hooks/**/*.{ts,tsx}',
    '../_common/ui-kit/**/*.{ts,tsx}',
  ],
  safelist: ['bg-calm-second/18'],
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
