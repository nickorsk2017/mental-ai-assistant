'use client';

import React, { type RefObject } from 'react';

import Button from '../../atoms/Button/Button';

import YearPickerDecadeGrid from './YearPickerDecadeGrid';

interface YearPickerMenuProperties {
  popoverReference: RefObject<HTMLDivElement | null>;
  dropdownPosition: { left: number; top: number; width: number };
  decadeStartYear: number;
  selectedCalendarYear: number;
  minimumCalendarYear: number;
  maximumCalendarYear: number;
  onSelectCalendarYear: (calendarYear: number) => void;
  onPreviousDecade: () => void;
  onNextDecade: () => void;
  onPickThisYear: () => void;
}

export default React.memo(function YearPickerMenu({
  popoverReference,
  dropdownPosition,
  decadeStartYear,
  selectedCalendarYear,
  minimumCalendarYear,
  maximumCalendarYear,
  onSelectCalendarYear,
  onPreviousDecade,
  onNextDecade,
  onPickThisYear,
}: YearPickerMenuProperties) {
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
      aria-label="Choose calendar year"
    >
      <YearPickerDecadeGrid
        decadeStartYear={decadeStartYear}
        selectedCalendarYear={selectedCalendarYear}
        minimumCalendarYear={minimumCalendarYear}
        maximumCalendarYear={maximumCalendarYear}
        onSelectCalendarYear={onSelectCalendarYear}
        onPreviousDecade={onPreviousDecade}
        onNextDecade={onNextDecade}
      />
      <div className="mt-3 flex justify-end border-t border-calm-border/45 pt-3">
        <Button type="button" variant="ghost" size="small" wide={false} onClick={onPickThisYear}>
          This year
        </Button>
      </div>
    </div>
  );
});
