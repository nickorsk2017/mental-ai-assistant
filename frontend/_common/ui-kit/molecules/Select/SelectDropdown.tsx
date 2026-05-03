import React from 'react';
import { createPortal } from 'react-dom';

import { cx } from '../../../utils';

type SelectOption = {
  label: string;
  value: string;
};

type DropdownPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
};

type SelectDropdownProps = {
  dropdownReference: React.RefObject<HTMLDivElement | null>;
  dropdownPosition: DropdownPosition;
  options: SelectOption[];
  selectedValues: string[];
  multiple: boolean;
  onOptionSelect: (optionValue: string) => void;
};

export default React.memo(function SelectDropdown({
  dropdownReference,
  dropdownPosition,
  options,
  selectedValues,
  multiple,
  onOptionSelect,
}: SelectDropdownProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={dropdownReference}
      className="fixed z-[10000] overflow-hidden rounded-xl border border-calm-border bg-calm-surface shadow-[0_18px_48px_rgba(43,49,76,0.16),0_6px_18px_rgba(43,49,76,0.10)]"
      style={{
        left: dropdownPosition.left,
        top: dropdownPosition.top,
        width: dropdownPosition.width,
      }}
    >
      <div
        role="listbox"
        aria-multiselectable={multiple}
        className="flex flex-col gap-0.5 overflow-y-auto p-1.5"
        style={{ maxHeight: dropdownPosition.maxHeight }}
      >
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onOptionSelect(option.value)}
              className={cx(
                'flex min-h-[38px] w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-calm-primary/12 text-calm-text'
                  : 'text-calm-muted hover:bg-calm-primary/8 hover:text-calm-text',
              )}
            >
              <span className="truncate">{option.label}</span>
              {isSelected ? <span className="h-2 w-2 rounded-full bg-calm-primary" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </div>,
    document.body,
  );
});
