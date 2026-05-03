import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { cx } from '../../../utils';
import SelectDropdown from './SelectDropdown';

type SelectOption = {
  label: string;
  value: string;
};

type SelectValue = string | string[];

type SelectProps = {
  value: SelectValue;
  onChange: (nextValue: SelectValue) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  errorMessage?: string;
  className?: string;
};

type DropdownPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
};

function getSelectedLabels(
  value: SelectValue,
  options: SelectOption[],
  placeholder?: string,
) {
  const selectedValues = Array.isArray(value) ? value : [value];
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  return selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;
}

function getNextMultipleValue(currentValue: SelectValue, optionValue: string) {
  const selectedValues = Array.isArray(currentValue) ? currentValue : [];

  return selectedValues.includes(optionValue)
    ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
    : [...selectedValues, optionValue];
}

export default React.memo(function Select({
  value,
  onChange,
  options,
  label,
  placeholder,
  multiple = false,
  errorMessage,
  className,
}: SelectProps) {
  const inputIdentifier = useId();
  const wrapperReference = useRef<HTMLDivElement>(null);
  const triggerReference = useRef<HTMLButtonElement>(null);
  const dropdownReference = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const displayText = useMemo(
    () => getSelectedLabels(value, options, placeholder),
    [options, placeholder, value],
  );
  const selectedValues = Array.isArray(value) ? value : [value];
  const inputClass = errorMessage
    ? 'border-calm-error bg-calm-surface text-calm-text'
    : 'border-calm-border bg-calm-surface text-calm-text';

  useEffect(() => {
    function handleDocumentPointerDown(event: PointerEvent) {
      const eventTarget = event.target as Node;
      const isInsideTrigger = wrapperReference.current?.contains(eventTarget);
      const isInsideDropdown = dropdownReference.current?.contains(eventTarget);

      if (!isInsideTrigger && !isInsideDropdown) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => document.removeEventListener('pointerdown', handleDocumentPointerDown);
  }, []);

  useLayoutEffect(() => {
    function updateDropdownPosition() {
      const triggerRectangle = triggerReference.current?.getBoundingClientRect();

      if (!triggerRectangle) return;

      const screenPadding = 12;
      const dropdownGap = 8;
      const preferredHeight = Math.min(220, options.length * 40 + 12);
      const spaceBelow = window.innerHeight - triggerRectangle.bottom - screenPadding;
      const spaceAbove = triggerRectangle.top - screenPadding;
      const shouldOpenAbove = spaceBelow < preferredHeight && spaceAbove > spaceBelow;
      const maxHeight = Math.max(
        120,
        Math.min(preferredHeight, shouldOpenAbove ? spaceAbove : spaceBelow),
      );

      setDropdownPosition({
        left: triggerRectangle.left,
        top: shouldOpenAbove
          ? Math.max(screenPadding, triggerRectangle.top - maxHeight - dropdownGap)
          : triggerRectangle.bottom + dropdownGap,
        width: triggerRectangle.width,
        maxHeight,
      });
    }

    if (!isOpen) return undefined;

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isOpen, options.length]);

  function handleOptionSelect(optionValue: string) {
    if (multiple) {
      onChange(getNextMultipleValue(value, optionValue));
      return;
    }

    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div ref={wrapperReference} className={cx('relative inline-flex w-full flex-col gap-1.5', className)}>
      {label ? <label className="text-label text-calm-muted" htmlFor={inputIdentifier}>{label}</label> : null}
      <button
        ref={triggerReference}
        id={inputIdentifier}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setIsOpen(false);
        }}
        className={cx(
          'flex min-h-[42px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-[10px] text-left text-body outline-none transition-all duration-150',
          'focus:border-calm-primary focus:ring-2 focus:ring-calm-primary/20',
          inputClass,
        )}
      >
        <span className={cx('truncate', displayText ? 'text-calm-text' : 'text-calm-muted')}>
          {displayText ?? placeholder}
        </span>
        <span
          aria-hidden
          className={cx(
            'h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 border-calm-text transition-transform duration-150',
            isOpen ? '-rotate-[135deg] translate-y-1' : '-translate-y-0.5',
          )}
        />
      </button>

      {isOpen && dropdownPosition ? (
        <SelectDropdown
          dropdownReference={dropdownReference}
          dropdownPosition={dropdownPosition}
          options={options}
          selectedValues={selectedValues}
          multiple={multiple}
          onOptionSelect={handleOptionSelect}
        />
      ) : null}
      {errorMessage ? <span className="text-caption text-calm-error">{errorMessage}</span> : null}
    </div>
  );
});
