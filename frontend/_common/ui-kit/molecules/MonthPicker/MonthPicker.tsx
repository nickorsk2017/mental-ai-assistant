'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  clampCalendarYear,
  formatCalendarMonthInput,
  parseCalendarMonthInputOrThisMonth,
} from '../../../utils';
import { Icon } from '../../atoms/Icon/Icon';

import MonthPickerMenu from './MonthPickerMenu';

const defaultMinimumCalendarYear = 2000;
const defaultMaximumCalendarYear = 2100;

interface MonthPickerProperties {
  value: string;
  onChange: (nextCalendarMonthInput: string) => void;
  label?: string;
  minimumCalendarYear?: number;
  maximumCalendarYear?: number;
}

export default React.memo(function MonthPicker({
  value,
  onChange,
  label,
  minimumCalendarYear = defaultMinimumCalendarYear,
  maximumCalendarYear = defaultMaximumCalendarYear,
}: MonthPickerProperties) {
  const inputIdentifier = useId();
  const wrapperReference = useRef<HTMLDivElement>(null);
  const triggerReference = useRef<HTMLButtonElement>(null);
  const popoverReference = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const selectedCalendarYear = useMemo(
    () =>
      clampCalendarYear(
        parseCalendarMonthInputOrThisMonth(value).calendarYear,
        minimumCalendarYear,
        maximumCalendarYear,
      ),
    [maximumCalendarYear, minimumCalendarYear, value],
  );

  const [visibleCalendarYear, setVisibleCalendarYear] = useState(() => selectedCalendarYear);

  const triggerLabel = useMemo(() => {
    const parsed = parseCalendarMonthInputOrThisMonth(value);

    return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
      new Date(parsed.calendarYear, parsed.calendarMonthIndex, 1),
    );
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setVisibleCalendarYear(selectedCalendarYear);
  }, [isOpen, selectedCalendarYear]);

  useEffect(() => {
    function handleDocumentPointerDown(event: PointerEvent) {
      const eventTarget = event.target as Node;
      const isInsideTrigger = wrapperReference.current?.contains(eventTarget);
      const isInsidePopover = popoverReference.current?.contains(eventTarget);

      if (!isInsideTrigger && !isInsidePopover) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () => document.removeEventListener('pointerdown', handleDocumentPointerDown);
  }, []);

  useLayoutEffect(() => {
    function updatePopoverPosition() {
      const triggerRectangle = triggerReference.current?.getBoundingClientRect();

      if (!triggerRectangle) {
        return;
      }

      const minimumPopoverWidthPixels = 280;

      setDropdownPosition({
        left: triggerRectangle.left,
        top: triggerRectangle.bottom + 8,
        width: Math.max(triggerRectangle.width, minimumPopoverWidthPixels),
      });
    }

    if (!isOpen) {
      return undefined;
    }

    updatePopoverPosition();
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);

    return () => {
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
  }, [isOpen]);

  function handleOpenToggle() {
    setIsOpen((previousIsOpen) => !previousIsOpen);
  }

  function handleSelectCalendarMonthIndex(calendarMonthIndex: number) {
    onChange(formatCalendarMonthInput(visibleCalendarYear, calendarMonthIndex));
    setIsOpen(false);
  }

  function handlePickThisMonth() {
    const today = new Date();
    const calendarYear = clampCalendarYear(
      today.getFullYear(),
      minimumCalendarYear,
      maximumCalendarYear,
    );

    onChange(formatCalendarMonthInput(calendarYear, today.getMonth()));
    setVisibleCalendarYear(calendarYear);
    setIsOpen(false);
  }

  function handlePreviousYear() {
    setVisibleCalendarYear((previousYear) =>
      clampCalendarYear(previousYear - 1, minimumCalendarYear, maximumCalendarYear),
    );
  }

  function handleNextYear() {
    setVisibleCalendarYear((previousYear) =>
      clampCalendarYear(previousYear + 1, minimumCalendarYear, maximumCalendarYear),
    );
  }

  const popoverContent =
    isOpen && dropdownPosition ? (
      <MonthPickerMenu
        popoverReference={popoverReference}
        dropdownPosition={dropdownPosition}
        visibleCalendarYear={visibleCalendarYear}
        currentCalendarMonthInput={value}
        minimumCalendarYear={minimumCalendarYear}
        maximumCalendarYear={maximumCalendarYear}
        onSelectCalendarMonthIndex={handleSelectCalendarMonthIndex}
        onPreviousYear={handlePreviousYear}
        onNextYear={handleNextYear}
        onPickThisMonth={handlePickThisMonth}
      />
    ) : null;

  return (
    <div ref={wrapperReference} className="flex w-full md:max-w-xs flex-col gap-1.5">
      {label ? (
        <label className="text-sm text-calm-muted" htmlFor={inputIdentifier}>
          {label}
        </label>
      ) : null}
      <button
        ref={triggerReference}
        id={inputIdentifier}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={handleOpenToggle}
        onKeyDown={(keyboardEvent) => {
          if (keyboardEvent.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className={`flex min-h-[42px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-solid bg-calm-surface px-3 py-2 text-left text-sm text-calm-text outline-none transition ${isOpen ? 'border-calm-primary ring-2 ring-calm-primary/20' : 'border-calm-border focus-visible:border-calm-primary focus-visible:ring-2 focus-visible:ring-calm-primary/20'}`}
      >
        <span className="truncate">{triggerLabel}</span>
        <span className="shrink-0 text-calm-muted" aria-hidden>
          <Icon name="calendar" size={18} color="currentColor" />
        </span>
      </button>
      {typeof document !== 'undefined' && popoverContent
        ? createPortal(popoverContent, document.body)
        : null}
    </div>
  );
});
