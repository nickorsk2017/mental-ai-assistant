import React from 'react';
import { ComponentSize, ThemeName } from '../../../themes/calm-theme';

type LoadingSpinnerProps = {
  size?: ComponentSize;
  themeName?: ThemeName;
  label?: string;
};

const spinnerSizeClassMap: Record<ComponentSize, string> = {
  small: 'h-[14px] w-[14px]',
  medium: 'h-5 w-5',
  large: 'h-7 w-7',
};

const LoadingSpinner = React.memo(function LoadingSpinner({
  size = 'medium',
  themeName = 'calmLight',
  label = 'Loading',
}: LoadingSpinnerProps) {
  const wrapperClassMap: Record<ThemeName, string> = {
    calmLight: 'text-calm-muted',
    calmDark: 'text-[#a7b1ce]',
  };
  const spinnerColorClassMap: Record<ThemeName, string> = {
    calmLight: 'border-calm-border border-t-calm-primary',
    calmDark: 'border-[#2f3a57] border-t-[#8ea8ff]',
  };

  return (
    <span className={`inline-flex items-center gap-2 ${wrapperClassMap[themeName]}`}>
      <span className={`animate-spin rounded-full border-2 ${spinnerSizeClassMap[size]} ${spinnerColorClassMap[themeName]}`} />
      <span>{label}</span>
    </span>
  );
});

export default LoadingSpinner;
