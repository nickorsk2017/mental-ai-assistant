'use client';

import React, { type RefObject } from 'react';

import Button from '../../atoms/Button/Button';

import DayPickerMonthGrid from './DayPickerMonthGrid';

interface DayPickerMenuProperties {
  popoverReference: RefObject<HTMLDivElement | null>;
  dropdownPosition: { left: number; top: number; width: number };
  visibleCalendarYear: number;
  visibleCalendarMonthIndex: number;
  selectedCalendarYear: number;
  selectedCalendarMonthIndex: number;
  selectedDayOfMonth: number;
  onSelectDayOfMonth: (dayOfMonth: number) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onPickToday: () => void;
}

export default React.memo(function DayPickerMenu({
  popoverReference,
  dropdownPosition,
  visibleCalendarYear,
  visibleCalendarMonthIndex,
  selectedCalendarYear,
  selectedCalendarMonthIndex,
  selectedDayOfMonth,
  onSelectDayOfMonth,
  onPreviousMonth,
  onNextMonth,
  onPickToday,
}: DayPickerMenuProperties) {
  return (
    <div
      ref={popoverReference}
      className="fixed z-[10000] rounded-2xl border border-calm-border bg-calm-surface p-3 shadow-[0_18px_48px_rgba(43,49,76,0.16),0_6px_18px_rgba(43,49,76,0.10)]"
      style={{
        left: dropdownPosition.left,
        top: dropdownPosition.top,
        width: dropdownPosition.width,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Choose calendar day"
    >
      <DayPickerMonthGrid
        visibleCalendarYear={visibleCalendarYear}
        visibleCalendarMonthIndex={visibleCalendarMonthIndex}
        selectedCalendarYear={selectedCalendarYear}
        selectedCalendarMonthIndex={selectedCalendarMonthIndex}
        selectedDayOfMonth={selectedDayOfMonth}
        onSelectDayOfMonth={onSelectDayOfMonth}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />
      <div className="mt-3 flex justify-end border-t border-calm-border/45 pt-3">
        <Button type="button" variant="ghost" size="small" wide={false} onClick={onPickToday}>
          Today
        </Button>
      </div>
    </div>
  );
});
