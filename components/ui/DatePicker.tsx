"use client"

import * as React from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { FaCalendar } from "react-icons/fa6"
import { Calendar } from "./Calendar"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./Select"
import { useEffect, useRef, useState } from "react"

interface DatePickerWithRangeProps {
    className?: string
    selectedDate: DateRange | undefined
    onDateChange: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
    className,
    selectedDate,
    onDateChange
}: DatePickerWithRangeProps) {
    const today = new Date()
    const defaultDateRange = { from: today, to: today }

    const [date, setDate] = useState<DateRange | undefined>(selectedDate || defaultDateRange)
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        setDate(selectedDate || defaultDateRange)
    }, [selectedDate])

    const handleDateChange = (newDate: Date | DateRange | undefined) => {
        if (newDate instanceof Date) {
            const singleDate = newDate as Date
            setDate({ from: singleDate, to: singleDate })
            onDateChange({ from: singleDate, to: singleDate })
            setIsOpen(false)
        } else if (newDate) {
            setDate(newDate)
            onDateChange(newDate)
            setIsOpen(false)
        }
    }

    const handlePreset = (preset: 'today' | 'thisWeek' | 'thisMonth' | 'thisYear') => {
        let newDateRange: DateRange
        const now = new Date()
        switch (preset) {
            case 'today':
                newDateRange = { from: today, to: today }
                break
            case 'thisWeek':
                newDateRange = { from: startOfWeek(now), to: endOfWeek(now) }
                break
            case 'thisMonth':
                newDateRange = { from: startOfMonth(now), to: endOfMonth(now) }
                break
            case 'thisYear':
                newDateRange = { from: startOfYear(now), to: endOfYear(now) }
                break
        }
        setDate(newDateRange)
        onDateChange(newDateRange)
        setIsOpen(false)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Select>
                <SelectTrigger
                    ref={triggerRef}
                    className="w-[300px] mb-5"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-controls="date-picker-content"
                >
                    <FaCalendar className="mr-2 h-4 w-4 text-gray-400" />
                    {date?.from ? (
                        date.to && date.from.getTime() !== date.to.getTime() ? (
                            `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date</span>
                    )}
                </SelectTrigger>
                {isOpen && (
                    <SelectContent
                        className="w-auto p-0"
                        align="start"
                        aria-labelledby="date-picker-trigger"
                        id="date-picker-content"
                    >
                        <div className="flex flex-col p-2">
                            <button onClick={() => handlePreset('today')} className="mb-2">Today</button>
                            <button onClick={() => handlePreset('thisWeek')} className="mb-2">This Week</button>
                            <button onClick={() => handlePreset('thisMonth')} className="mb-2">This Month</button>
                            <button onClick={() => handlePreset('thisYear')} className="mb-2">This Year</button>
                            <div className="rounded-md border">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={(range) => {
                                        if (range && range.from) {
                                            handleDateChange(range.from)
                                        }
                                    }}
                                    numberOfMonths={2}
                                />
                            </div>
                        </div>
                    </SelectContent>
                )}
            </Select>
        </div>
    )
}
