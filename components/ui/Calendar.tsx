'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-secondary-foreground transition hover:border-primary/60 hover:text-primary-foreground',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/10 [&:has([aria-selected])]:bg-accent/30 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-sm text-secondary-foreground transition hover:border-primary/40 aria-selected:bg-primary/20 aria-selected:text-primary-foreground aria-selected:shadow-[0_0_12px_rgba(129,140,248,0.35)]',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary/80 text-primary-foreground hover:bg-primary/80 focus:bg-primary/80 focus:text-primary-foreground',
        day_today: 'bg-primary/20 text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/30 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-primary/10 aria-selected:text-primary-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <FaChevronLeft className="h-4 w-4" />,
        IconRight: () => <FaChevronRight className="h-4 w-4" />,
      }}
      disabled={{ after: today }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
