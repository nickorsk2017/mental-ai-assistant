export type ThemeName = 'calmLight' | 'calmDark';
export type ComponentSize = 'small' | 'medium' | 'large';

export type SoftCalmTheme = {
  colors: {
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    primary: string;
    second: string;
    black: string;
    blackSoft: string;
    blackSoftDeep: string;
    primaryText: string;
    mutedSurface: string;
    danger: string;
    label: string;
    moodDepression: string;
    moodDepressionSurface: string;
    moodNormal: string;
    moodNormalDeep: string;
    moodNormalSurface: string;
    moodEuphoria: string;
    moodEuphoriaSurface: string;
  };
};

const calmLightTheme: SoftCalmTheme = {
  colors: {
    surface: '#ffffff',
    textPrimary: '#313a54',
    textSecondary: '#7f8aa8',
    border: '#dbe5fb',
    primary: '#e48a3a',
    second: '#6f8cff',
    black: '#313a54',
    blackSoft: '#7a8399',
    blackSoftDeep: '#5d667c',
    primaryText: '#ffffff',
    mutedSurface: '#f4f7ff',
    danger: '#f56f86',
    label: '#66708a',
    moodDepression: '#9aa4bf',
    moodDepressionSurface: '#eef1f7',
    moodNormal: '#b5ead7',
    moodNormalDeep: '#3f8a70',
    moodNormalSurface: '#eefaf5',
    moodEuphoria: '#fac4cf',
    moodEuphoriaSurface: '#fff3f6',
  },
};

const calmDarkTheme: SoftCalmTheme = {
  colors: {
    surface: '#1b2338',
    textPrimary: '#edf2ff',
    textSecondary: '#b1bcdb',
    border: '#34405f',
    primary: '#d9964f',
    second: '#90a8ff',
    black: '#edf2ff',
    blackSoft: '#f4f6fc',
    blackSoftDeep: '#e3e8f4',
    primaryText: '#0f1630',
    mutedSurface: '#11182b',
    danger: '#ff9ab0',
    label: '#9bb0ff',
    moodDepression: '#8d98b5',
    moodDepressionSurface: '#242b3d',
    moodNormal: '#a8e7d3',
    moodNormalDeep: '#5fbea0',
    moodNormalSurface: '#18302a',
    moodEuphoria: '#f5bdc9',
    moodEuphoriaSurface: '#34242c',
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
