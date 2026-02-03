import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  subDays,
} from 'date-fns';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FaCalendar } from 'react-icons/fa6';
import { Badge } from './Badge';
import Button from './Button';
import { Calendar } from './Calendar';
import { Select, SelectContent, SelectTrigger } from './Select';
import { cn } from '@/lib/utils';

interface DatePickerWithRangeProps {
  className?: string;
  selectedDate: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  isRange: boolean;
  compact?: boolean;
}

export function DatePickerWithRange({
  className,
  selectedDate,
  onDateChange,
  isRange,
  compact = false,
}: DatePickerWithRangeProps) {
  const today = new Date();
  const defaultDateRange = { from: today, to: today };
  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range) {
      handleDateChange(range);
    }
  };

  const handleSingleSelect = (date: Date | undefined) => {
    if (date) {
      handleDateChange({ from: date, to: date });
    }
  };

  const [date, setDate] = useState<DateRange | undefined>(
    selectedDate || defaultDateRange,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDate(selectedDate || defaultDateRange);
  }, [selectedDate]);

  const handleDateChange = (newDate: DateRange) => {
    if (newDate) {
      if (!isRange) {
        const singleDate = newDate.from;
        setDate({ from: singleDate, to: singleDate });
        onDateChange({ from: singleDate, to: singleDate });
      } else {
        setDate(newDate);
        onDateChange(newDate);
      }
      setIsOpen(false);
    }
  };

  const handlePreset = (
    preset: 'today' | 'last7Days' | 'thisWeek' | 'thisMonth' | 'thisYear',
  ) => {
    let newDateRange: DateRange;
    const now = new Date();
    switch (preset) {
      case 'today':
        newDateRange = { from: today, to: today };
        break;
      case 'last7Days':
        newDateRange = { from: subDays(now, 6), to: now };
        break;
      case 'thisWeek':
        newDateRange = { from: startOfWeek(now), to: endOfWeek(now) };
        break;
      case 'thisMonth':
        newDateRange = { from: startOfMonth(now), to: endOfMonth(now) };
        break;
      case 'thisYear':
        newDateRange = { from: startOfYear(now), to: endOfYear(now) };
        break;
    }
    setDate(newDateRange);
    onDateChange(newDateRange);
    setSelectedPreset(preset);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedPreset(null);
    const resetTo = isRange ? defaultDateRange : { from: today, to: today };
    setDate(resetTo);
    onDateChange(resetTo);
  };

  const renderSummaryLabel = () => {
    if (!date?.from) return 'Pick a date';
    if (
      !isRange ||
      (date.from && date.to && date.from.getTime() === date.to.getTime())
    ) {
      return format(date.from, 'LLL dd, y');
    }
    if (date.from && date.to) {
      return `${format(date.from, 'LLL dd, y')} → ${format(date.to, 'LLL dd, y')}`;
    }
    return format(date.from, 'LLL dd, y');
  };

  const renderInputSummary = () => (
    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted">
      <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-secondary-foreground">
        Start:&nbsp;
        <strong className="font-semibold text-primary-foreground tracking-normal">
          {date?.from ? format(date.from, 'LLL dd, y') : '—'}
        </strong>
      </span>
      {isRange && (
        <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-secondary-foreground">
          End:&nbsp;
          <strong className="font-semibold text-primary-foreground tracking-normal">
            {date?.to
              ? format(date.to, 'LLL dd, y')
              : date?.from
                ? format(date.from, 'LLL dd, y')
                : '—'}
          </strong>
        </span>
      )}
      <Button
        variant="ghost"
        paddingLess
        onClick={handleClear}
        className="text-[0.65rem]"
      >
        Clear
      </Button>
    </div>
  );

  return (
    <div className={cn('grid gap-2', className, compact && 'gap-1')}>
      {!compact && renderInputSummary()}
      <Select>
        <SelectTrigger
          ref={triggerRef}
          className={cn(
            'rounded-2xl border border-white/15 bg-white/5 px-3 text-left text-sm text-secondary-foreground',
            compact ? 'h-10 w-60' : 'h-11 w-full',
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="date-picker-content"
        >
          <FaCalendar className="mr-2 h-4 w-4 text-gray-400" />
          <span className="truncate">{renderSummaryLabel()}</span>
        </SelectTrigger>
        {isOpen && (
          <SelectContent
            className="w-auto p-0"
            align="start"
            aria-labelledby="date-picker-trigger"
            id="date-picker-content"
          >
            <div className="flex flex-col gap-4 p-4">
              {isRange && (
                <div
                  className={cn(
                    'flex flex-wrap justify-center gap-2',
                    compact && 'justify-start',
                  )}
                >
                  <Badge
                    onClick={() => handlePreset('today')}
                    variant={
                      selectedPreset === 'today' ? 'default' : 'secondary'
                    }
                    className="cursor-pointer"
                  >
                    Today
                  </Badge>
                  <Badge
                    onClick={() => handlePreset('last7Days')}
                    variant={
                      selectedPreset === 'last7Days' ? 'default' : 'secondary'
                    }
                    className="cursor-pointer"
                  >
                    Last 7 days
                  </Badge>
                  <Badge
                    onClick={() => handlePreset('thisWeek')}
                    variant={
                      selectedPreset === 'thisWeek' ? 'default' : 'secondary'
                    }
                    className="cursor-pointer"
                  >
                    This Week
                  </Badge>
                  <Badge
                    onClick={() => handlePreset('thisMonth')}
                    variant={
                      selectedPreset === 'thisMonth' ? 'default' : 'secondary'
                    }
                    className="cursor-pointer"
                  >
                    This Month
                  </Badge>
                  <Badge
                    onClick={() => handlePreset('thisYear')}
                    variant={
                      selectedPreset === 'thisYear' ? 'default' : 'secondary'
                    }
                    className="cursor-pointer"
                  >
                    This Year
                  </Badge>
                </div>
              )}
              <div className="rounded-md border">
                {isRange ? (
                  <Calendar
                    initialFocus={true}
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date as DateRange | undefined}
                    onSelect={handleRangeSelect}
                    numberOfMonths={2}
                    disabled={{ after: today }}
                  />
                ) : (
                  <Calendar
                    initialFocus={true}
                    mode="single"
                    defaultMonth={date?.from}
                    selected={date?.from}
                    onSelect={handleSingleSelect}
                    numberOfMonths={2}
                    disabled={{ after: today }}
                  />
                )}
              </div>
              {!compact && (
                <p className="text-center text-xs text-muted">
                  {isRange
                    ? 'Click a start date and an end date to build your range.'
                    : 'Pick any single day; use presets for shortcuts.'}
                </p>
              )}
            </div>
          </SelectContent>
        )}
      </Select>
    </div>
  );
}
