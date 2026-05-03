 'use client';

import React, { useId, useState } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import { ComponentSize } from '../../../themes/calm-theme';
import Button from '../../atoms/Button/Button';

type InputType = 'text' | 'password';

type TextInputProps = {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  label?: string;
  type?: InputType;
  size?: ComponentSize;
  errorMessage?: string;
  autoFocus?: boolean;
  autoComplete?: string;
};

export default React.memo(function TextInput({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  size = 'medium',
  errorMessage,
  autoFocus = false,
  autoComplete = 'off',
}: TextInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const id = useId();

  const currentType = type === 'password' && isPasswordVisible ? 'text' : type;
  const sizeClassMap: Record<ComponentSize, string> = {
    small: 'min-h-[34px] px-[10px] py-2 text-label',
    medium: 'min-h-[42px] px-3 py-[10px] text-body',
    large: 'min-h-[48px] px-[14px] py-3 text-medium',
  };
  const inputClass = !!errorMessage
    ? 'border-calm-error bg-calm-surface text-calm-text'
    : 'border-calm-border bg-calm-surface text-calm-text';

  return (
    <div className="inline-flex w-full flex-col gap-1.5">
      {label ? <label className="text-label text-calm-muted" htmlFor={id}>{label}</label> : null}
      <div className="inline-flex w-full items-center gap- relative">
        <input
          type={currentType}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border outline-none transition-all duration-150 focus:border-calm-primary focus:ring-2 focus:ring-calm-primary/20 ${sizeClassMap[size]} ${inputClass}`}
        />
        {type === 'password' ? (
          <Button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            variant="ghost"
            wide={false}
            className="absolute right-3 top-1/2 min-h-0 -translate-y-1/2 border-none p-0 text-calm-muted"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#8b90a7" />
          </Button>
        ) : null}
      </div>
      {errorMessage ? <span className="text-caption text-calm-error">{errorMessage}</span> : null}
    </div>
  );
});
