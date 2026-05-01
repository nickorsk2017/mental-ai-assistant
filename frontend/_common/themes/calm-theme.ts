export type ThemeName = 'calmLight' | 'calmDark';
export type ComponentSize = 'small' | 'medium' | 'large';

export type SoftCalmTheme = {
  colors: {
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryText: string;
    mutedSurface: string;
    danger: string;
    label: string;
  };
};

const calmLightTheme: SoftCalmTheme = {
  colors: {
    surface: '#ffffff',
    textPrimary: '#3d4255',
    textSecondary: '#8b90a7',
    border: '#e5e7f0',
    primary: '#7c9cf5',
    primaryText: '#ffffff',
    mutedSurface: '#f8f9fe',
    danger: '#f87171',
    label: '#6b7280',
  },
};

const calmDarkTheme: SoftCalmTheme = {
  colors: {
    surface: '#1c2233',
    textPrimary: '#e8ecfa',
    textSecondary: '#a7b1ce',
    border: '#2f3a57',
    primary: '#8ea8ff',
    primaryText: '#0b1020',
    mutedSurface: '#13192b',
    danger: '#fca5a5',
    label: '#8ea8ff',
  },
};

export const themeMap: Record<ThemeName, SoftCalmTheme> = {
  calmLight: calmLightTheme,
  calmDark: calmDarkTheme,
};

export const softCalmTheme = calmLightTheme;

export const tailwindBoxShadowTokens = {
  subtle: '0 1px 2px rgba(17, 24, 39, 0.08)',
  soft: '0 8px 20px rgba(17, 24, 39, 0.08)',
  medium: '0 12px 30px rgba(17, 24, 39, 0.12)',
  lifted: '0 20px 40px rgba(17, 24, 39, 0.16)',
} as const;

export const tailwindFontSizeTokens = {
  caption: ['12px', { lineHeight: '1.4' }],
  body: ['14px', { lineHeight: '1.5' }],
  medium: ['16px', { lineHeight: '1.5' }],
  heading: ['20px', { lineHeight: '1.3' }],
  label: ['13px', { lineHeight: '1.4' }],
} as const;
