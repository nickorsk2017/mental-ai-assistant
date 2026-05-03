 'use client';

import React, { useEffect, useId, useRef } from 'react';

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
  maxHeight?: number;
  onKeyDown?: (keyboardEvent: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaReference?: React.RefObject<HTMLTextAreaElement | null>;
};

function resizeTextArea(textAreaElement: HTMLTextAreaElement, maxHeight: number): void {
  textAreaElement.style.height = 'auto';
  textAreaElement.style.height = `${Math.min(textAreaElement.scrollHeight, maxHeight)}px`;
  textAreaElement.style.overflowY = textAreaElement.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

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
  maxHeight = 200,
  onKeyDown,
  textareaReference,
}: TextAreaProps) {
  const id = useId();
  const internalTextAreaReference = useRef<HTMLTextAreaElement | null>(null);
  const inputClass = errorMessage
    ? 'border-calm-error bg-calm-surface text-calm-text'
    : 'border-calm-border bg-calm-surface text-calm-text';

  useEffect(() => {
    const textAreaElement = internalTextAreaReference.current;

    if (textAreaElement) {
      resizeTextArea(textAreaElement, maxHeight);
    }
  }, [maxHeight, value]);

  return (
    <div className={cx('inline-flex w-full flex-col gap-1.5', className)}>
      {label ? <label className="text-label text-calm-muted" htmlFor={id}>{label}</label> : null}
      <textarea
        ref={(textAreaElement) => {
          internalTextAreaReference.current = textAreaElement;
          if (textareaReference) {
            textareaReference.current = textAreaElement;
          }
        }}
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onChange={(event) => {
          resizeTextArea(event.target, maxHeight);
          onChange(event.target.value);
        }}
        className={cx(
          'w-full resize-y rounded-xl border px-3 py-[10px] text-body leading-6 outline-none transition-all duration-150 focus:border-calm-primary focus:ring-2 focus:ring-calm-primary/20',
          inputClass,
          textareaClassName,
        )}
      />
      {errorMessage ? <span className="text-caption text-calm-error">{errorMessage}</span> : null}
    </div>
  );
});
