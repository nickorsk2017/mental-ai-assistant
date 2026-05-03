'use client';

import React, { useMemo } from 'react';

import Button from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import {
  buildCalendarMonthDayCells,
  calendarWeekdayLabelsShortEnglish,
  isCalendarLocalToday,
} from '../../../utils';

interface DayPickerMonthGridProperties {
  visibleCalendarYear: number;
  visibleCalendarMonthIndex: number;
  selectedCalendarYear: number;
  selectedCalendarMonthIndex: number;
  selectedDayOfMonth: number;
  onSelectDayOfMonth: (dayOfMonth: number) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const monthTitleFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
});

export default React.memo(function DayPickerMonthGrid({
  visibleCalendarYear,
  visibleCalendarMonthIndex,
  selectedCalendarYear,
  selectedCalendarMonthIndex,
  selectedDayOfMonth,
  onSelectDayOfMonth,
  onPreviousMonth,
  onNextMonth,
}: DayPickerMonthGridProperties) {
  const dayCells = useMemo(
    () => buildCalendarMonthDayCells(visibleCalendarYear, visibleCalendarMonthIndex),
    [visibleCalendarMonthIndex, visibleCalendarYear],
  );

  const monthTitle = useMemo(
    () => monthTitleFormatter.format(new Date(visibleCalendarYear, visibleCalendarMonthIndex, 1)),
    [visibleCalendarMonthIndex, visibleCalendarYear],
  );

  return (
    <div className="w-full min-w-[260px]">
      <div className="mb-2 flex items-center gap-2 border-b border-calm-border/50 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="small"
          wide={false}
          rounded
          className="!h-8 !w-8 shrink-0 !min-h-0 !p-0 text-calm-muted"
          aria-label="Previous month"
          onClick={onPreviousMonth}
        >
          <Icon name="arrow-left" size={18} color="currentColor" />
        </Button>
        <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-calm-text">
          {monthTitle}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="small"
          wide={false}
          rounded
          className="!h-8 !w-8 shrink-0 !min-h-0 !p-0 text-calm-muted"
          aria-label="Next month"
          onClick={onNextMonth}
        >
          <Icon name="arrow-left" size={18} color="currentColor" className="rotate-180" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-medium text-calm-muted">
        {calendarWeekdayLabelsShortEnglish.map((weekdayLabel) => (
          <div key={weekdayLabel} className="py-1">
            {weekdayLabel}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayCells.map((dayOfMonth, cellIndex) => {
          if (dayOfMonth === null) {
            return <div key={`empty-${cellIndex}`} className="aspect-square min-h-[36px]" />;
          }

          const isSelected =
            selectedCalendarYear === visibleCalendarYear &&
            selectedCalendarMonthIndex === visibleCalendarMonthIndex &&
            selectedDayOfMonth === dayOfMonth;

          const isToday = isCalendarLocalToday(
            visibleCalendarYear,
            visibleCalendarMonthIndex,
            dayOfMonth,
          );

          return (
            <button
              key={`day-${dayOfMonth}-${cellIndex}`}
              type="button"
              className={`flex aspect-square min-h-[36px] items-center justify-center rounded-lg text-sm font-medium transition ${
                isSelected
                  ? 'bg-calm-black text-calm-primary-text'
                  : 'text-calm-text hover:bg-calm-background/80'
              } ${isToday && !isSelected ? 'ring-1 ring-inset ring-calm-second/50' : ''}`}
              onClick={() => onSelectDayOfMonth(dayOfMonth)}
            >
              {dayOfMonth}
            </button>
          );
        })}
      </div>
    </div>
  );
});
