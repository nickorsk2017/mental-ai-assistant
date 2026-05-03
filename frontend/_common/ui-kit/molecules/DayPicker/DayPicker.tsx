'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  formatCalendarDateInput,
  parseCalendarDateInputOrToday,
  shiftCalendarMonth,
} from '../../../utils';
import { Icon } from '../../atoms/Icon/Icon';

import DayPickerMenu from './DayPickerMenu';

interface DayPickerProperties {
  value: string;
  onChange: (nextCalendarDateInput: string) => void;
  label?: string;
}

interface DropdownPosition {
  left: number;
  top: number;
  width: number;
}

export default React.memo(function DayPicker({ value, onChange, label }: DayPickerProperties) {
  const inputIdentifier = useId();
  const wrapperReference = useRef<HTMLDivElement>(null);
  const triggerReference = useRef<HTMLButtonElement>(null);
  const popoverReference = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const [visibleCalendarYear, setVisibleCalendarYear] = useState(() =>
    parseCalendarDateInputOrToday(value).calendarYear,
  );
  const [visibleCalendarMonthIndex, setVisibleCalendarMonthIndex] = useState(() =>
    parseCalendarDateInputOrToday(value).calendarMonthIndex,
  );

  const selectedParts = useMemo(() => parseCalendarDateInputOrToday(value), [value]);

  const formattedTriggerLabel = useMemo(() => {
    const date = new Date(
      selectedParts.calendarYear,
      selectedParts.calendarMonthIndex,
      selectedParts.dayOfMonth,
    );

    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
  }, [selectedParts]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const parsed = parseCalendarDateInputOrToday(value);

    setVisibleCalendarYear(parsed.calendarYear);
    setVisibleCalendarMonthIndex(parsed.calendarMonthIndex);
  }, [isOpen, value]);

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

  function handleSelectDayOfMonth(dayOfMonth: number) {
    onChange(
      formatCalendarDateInput(visibleCalendarYear, visibleCalendarMonthIndex, dayOfMonth),
    );
    setIsOpen(false);
  }

  function handlePickToday() {
    const today = new Date();

    onChange(
      formatCalendarDateInput(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ),
    );
    setVisibleCalendarYear(today.getFullYear());
    setVisibleCalendarMonthIndex(today.getMonth());
    setIsOpen(false);
  }

  function handlePreviousMonth() {
    const shifted = shiftCalendarMonth(visibleCalendarYear, visibleCalendarMonthIndex, -1);

    setVisibleCalendarYear(shifted.calendarYear);
    setVisibleCalendarMonthIndex(shifted.calendarMonthIndex);
  }

  function handleNextMonth() {
    const shifted = shiftCalendarMonth(visibleCalendarYear, visibleCalendarMonthIndex, 1);

    setVisibleCalendarYear(shifted.calendarYear);
    setVisibleCalendarMonthIndex(shifted.calendarMonthIndex);
  }

  const popoverContent =
    isOpen && dropdownPosition ? (
      <DayPickerMenu
        popoverReference={popoverReference}
        dropdownPosition={dropdownPosition}
        visibleCalendarYear={visibleCalendarYear}
        visibleCalendarMonthIndex={visibleCalendarMonthIndex}
        selectedCalendarYear={selectedParts.calendarYear}
        selectedCalendarMonthIndex={selectedParts.calendarMonthIndex}
        selectedDayOfMonth={selectedParts.dayOfMonth}
        onSelectDayOfMonth={handleSelectDayOfMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onPickToday={handlePickToday}
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
        <span className="truncate">{formattedTriggerLabel}</span>
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
