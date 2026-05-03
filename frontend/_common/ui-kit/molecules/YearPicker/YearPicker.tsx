'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  clampCalendarYear,
  getDecadeStartYear,
  shiftDecadeStartYear,
} from '../../../utils';
import { Icon } from '../../atoms/Icon/Icon';

import YearPickerMenu from './YearPickerMenu';

const defaultMinimumCalendarYear = 2000;
const defaultMaximumCalendarYear = 2100;

interface YearPickerProperties {
  value: number;
  onChange: (nextCalendarYear: number) => void;
  label?: string;
  minimumCalendarYear?: number;
  maximumCalendarYear?: number;
}

interface DropdownPosition {
  left: number;
  top: number;
  width: number;
}

export default React.memo(function YearPicker({
  value,
  onChange,
  label,
  minimumCalendarYear = defaultMinimumCalendarYear,
  maximumCalendarYear = defaultMaximumCalendarYear,
}: YearPickerProperties) {
  const inputIdentifier = useId();
  const wrapperReference = useRef<HTMLDivElement>(null);
  const triggerReference = useRef<HTMLButtonElement>(null);
  const popoverReference = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const selectedCalendarYear = useMemo(
    () =>
      clampCalendarYear(
        Number.isFinite(value) && !Number.isNaN(value) ? value : minimumCalendarYear,
        minimumCalendarYear,
        maximumCalendarYear,
      ),
    [value, maximumCalendarYear, minimumCalendarYear],
  );
  const [visibleDecadeStartYear, setVisibleDecadeStartYear] = useState(() =>
    getDecadeStartYear(selectedCalendarYear),
  );

  const triggerLabel = useMemo(() => String(selectedCalendarYear), [selectedCalendarYear]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setVisibleDecadeStartYear(getDecadeStartYear(selectedCalendarYear));
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

  function handleSelectCalendarYear(calendarYear: number) {
    onChange(clampCalendarYear(calendarYear, minimumCalendarYear, maximumCalendarYear));
    setIsOpen(false);
  }

  function handlePickThisYear() {
    const today = new Date();
    const currentYear = clampCalendarYear(
      today.getFullYear(),
      minimumCalendarYear,
      maximumCalendarYear,
    );

    onChange(currentYear);
    setVisibleDecadeStartYear(getDecadeStartYear(currentYear));
    setIsOpen(false);
  }

  function handlePreviousDecade() {
    setVisibleDecadeStartYear((previousDecadeStart) =>
      shiftDecadeStartYear(previousDecadeStart, -1, minimumCalendarYear, maximumCalendarYear),
    );
  }

  function handleNextDecade() {
    setVisibleDecadeStartYear((previousDecadeStart) =>
      shiftDecadeStartYear(previousDecadeStart, 1, minimumCalendarYear, maximumCalendarYear),
    );
  }

  const popoverContent =
    isOpen && dropdownPosition ? (
      <YearPickerMenu
        popoverReference={popoverReference}
        dropdownPosition={dropdownPosition}
        decadeStartYear={visibleDecadeStartYear}
        selectedCalendarYear={selectedCalendarYear}
        minimumCalendarYear={minimumCalendarYear}
        maximumCalendarYear={maximumCalendarYear}
        onSelectCalendarYear={handleSelectCalendarYear}
        onPreviousDecade={handlePreviousDecade}
        onNextDecade={handleNextDecade}
        onPickThisYear={handlePickThisYear}
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
