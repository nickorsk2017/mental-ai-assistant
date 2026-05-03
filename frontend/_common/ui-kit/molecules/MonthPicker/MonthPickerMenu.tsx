'use client';

import React, { type RefObject } from 'react';

import Button from '../../atoms/Button/Button';

import MonthPickerMonthGrid from './MonthPickerMonthGrid';

interface MonthPickerMenuProperties {
  popoverReference: RefObject<HTMLDivElement | null>;
  dropdownPosition: { left: number; top: number; width: number };
  visibleCalendarYear: number;
  currentCalendarMonthInput: string;
  minimumCalendarYear: number;
  maximumCalendarYear: number;
  onSelectCalendarMonthIndex: (calendarMonthIndex: number) => void;
  onPreviousYear: () => void;
  onNextYear: () => void;
  onPickThisMonth: () => void;
}

export default React.memo(function MonthPickerMenu({
  popoverReference,
  dropdownPosition,
  visibleCalendarYear,
  currentCalendarMonthInput,
  minimumCalendarYear,
  maximumCalendarYear,
  onSelectCalendarMonthIndex,
  onPreviousYear,
  onNextYear,
  onPickThisMonth,
}: MonthPickerMenuProperties) {
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
      aria-label="Choose calendar month"
    >
      <MonthPickerMonthGrid
        visibleCalendarYear={visibleCalendarYear}
        currentCalendarMonthInput={currentCalendarMonthInput}
        minimumCalendarYear={minimumCalendarYear}
        maximumCalendarYear={maximumCalendarYear}
        onSelectCalendarMonthIndex={onSelectCalendarMonthIndex}
        onPreviousYear={onPreviousYear}
        onNextYear={onNextYear}
      />
      <div className="mt-3 flex justify-end border-t border-calm-border/45 pt-3">
        <Button type="button" variant="ghost" size="small" wide={false} onClick={onPickThisMonth}>
          This month
        </Button>
      </div>
    </div>
  );
});
