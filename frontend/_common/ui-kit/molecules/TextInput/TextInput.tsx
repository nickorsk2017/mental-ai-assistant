import React, { useId, useState } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import { ComponentSize } from '../../../themes/calm-theme';

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
          className={`w-full rounded-xl border outline-none ${sizeClassMap[size]} ${inputClass}`}
        />
        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            className="cursor-pointer border-none bg-transparent text-calm-muted absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#8b90a7" />
          </button>
        ) : null}
      </div>
      {errorMessage ? <span className="text-caption text-calm-error">{errorMessage}</span> : null}
    </div>
  );
});
