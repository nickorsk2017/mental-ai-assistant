'use client';

import React from 'react';

import Button from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { calendarMonthLabelsShort, formatCalendarMonthInput } from '../../../utils';

interface MonthPickerMonthGridProperties {
  visibleCalendarYear: number;
  currentCalendarMonthInput: string;
  minimumCalendarYear: number;
  maximumCalendarYear: number;
  onSelectCalendarMonthIndex: (calendarMonthIndex: number) => void;
  onPreviousYear: () => void;
  onNextYear: () => void;
}

export default React.memo(function MonthPickerMonthGrid({
  visibleCalendarYear,
  currentCalendarMonthInput,
  minimumCalendarYear,
  maximumCalendarYear,
  onSelectCalendarMonthIndex,
  onPreviousYear,
  onNextYear,
}: MonthPickerMonthGridProperties) {
  const isPreviousYearDisabled = visibleCalendarYear <= minimumCalendarYear;
  const isNextYearDisabled = visibleCalendarYear >= maximumCalendarYear;

  return (
    <div className="w-full min-w-[260px]">
      <div className="mb-2 flex items-center gap-2 border-b border-calm-border/50 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="small"
          wide={false}
          rounded
          disabled={isPreviousYearDisabled}
          className="!h-8 !w-8 shrink-0 !min-h-0 !p-0 text-calm-muted disabled:opacity-40"
          aria-label="Previous year"
          onClick={onPreviousYear}
        >
          <Icon name="arrow-left" size={18} color="currentColor" />
        </Button>
        <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-calm-text">
          {visibleCalendarYear}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="small"
          wide={false}
          rounded
          disabled={isNextYearDisabled}
          className="!h-8 !w-8 shrink-0 !min-h-0 !p-0 text-calm-muted disabled:opacity-40"
          aria-label="Next year"
          onClick={onNextYear}
        >
          <Icon name="arrow-left" size={18} color="currentColor" className="rotate-180" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-1">
        {calendarMonthLabelsShort.map((monthLabel, calendarMonthIndex) => {
          const isSelected =
            currentCalendarMonthInput ===
            formatCalendarMonthInput(visibleCalendarYear, calendarMonthIndex);

          return (
            <button
              key={`${visibleCalendarYear}-${calendarMonthIndex}`}
              type="button"
              className={`flex min-h-[40px] items-center justify-center rounded-lg px-1 py-2 text-xs font-medium transition sm:text-sm ${
                isSelected
                  ? 'bg-calm-black text-calm-primary-text'
                  : 'text-calm-text hover:bg-calm-background/80'
              }`}
              onClick={() => onSelectCalendarMonthIndex(calendarMonthIndex)}
            >
              {monthLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
});
