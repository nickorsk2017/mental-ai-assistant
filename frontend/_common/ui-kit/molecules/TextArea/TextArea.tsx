import React, { useId } from 'react';

import { cx } from '../../../utils';

type TextAreaProps = {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  errorMessage?: string;
  autoFocus?: boolean;
  className?: string;
  textareaClassName?: string;
  onKeyDown?: (keyboardEvent: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaReference?: React.RefObject<HTMLTextAreaElement | null>;
};

export default React.memo(function TextArea({
  value,
  onChange,
  placeholder,
  label,
  rows = 3,
  errorMessage,
  autoFocus = false,
  className,
  textareaClassName,
  onKeyDown,
  textareaReference,
}: TextAreaProps) {
  const id = useId();
  const inputClass = errorMessage
    ? 'border-calm-error bg-calm-surface text-calm-text'
    : 'border-calm-border bg-calm-surface text-calm-text';

  return (
    <div className={cx('inline-flex w-full flex-col gap-1.5', className)}>
      {label ? <label className="text-label text-calm-muted" htmlFor={id}>{label}</label> : null}
      <textarea
        ref={textareaReference}
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          'w-full resize-y rounded-xl border px-3 py-[10px] text-body leading-6 outline-none',
          inputClass,
          textareaClassName,
        )}
      />
      {errorMessage ? <span className="text-caption text-calm-error">{errorMessage}</span> : null}
    </div>
  );
});
