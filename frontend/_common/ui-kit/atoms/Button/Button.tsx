import React from 'react';
import { ComponentSize } from '../../../themes/calm-theme';
import { cx } from '../../../utils';

type ButtonVariant = 'primary' | 'black' | 'outline' | 'ghost';

type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'onClick' | 'type'
> & {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ComponentSize;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  wide?: boolean;
  rounded?: boolean;
};

export const Button = React.memo(function Button({
  type = 'button',
  children,
  onClick,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  isLoading = false,
  className,
  wide,
  rounded,
  ...buttonAttributes
}: ButtonProps) {
  const sizeClassMap: Record<ComponentSize, string> = {
    small: 'min-h-[34px] px-3.5 py-2 text-label rounded-[10px]',
    medium: 'min-h-[42px] px-[18px] py-3 text-body rounded-[12px]',
    large: 'min-h-[48px] px-[22px] py-3.5 text-medium rounded-[14px]',
  };

  const variantClassMap: Record<ButtonVariant, string> = {
    primary: 'bg-calm-primary border-calm-primary text-calm-primary-text',
    black: 'bg-calm-black border-calm-black text-calm-primary-text',
    outline: 'bg-transparent border-calm-border text-calm-text',
    ghost: 'bg-transparent border-transparent text-calm-muted',
  };

  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...buttonAttributes}
      className={cx(
        'border font-semibold outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-calm-primary/20 !flex-none',
        sizeClassMap[size],
        variantClassMap[variant],
        (wide === true || wide === undefined) ? 'w-full' : 'w-auto',
        disabled || isLoading ? 'cursor-not-allowed opacity-50' : '!cursor-pointer hover:brightness-95',
        rounded ? 'rounded-full' : 'rounded-[12px]',
        className,
      )}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
});

export default Button;
