"use client"

import * as React from "react"
import {  format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { FaCalendar } from "react-icons/fa6"
import { Calendar } from "./Calendar"
import { Select, SelectContent, SelectTrigger } from "./Select"
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
    const [date, setDate] = React.useState<DateRange | undefined>(selectedDate)
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setDate(selectedDate)
    }, [selectedDate])

    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate)
        onDateChange(newDate)
        if (newDate && newDate.from && newDate.to) {
            setIsOpen(false); // Close the select when both dates are selected
        }
    }

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Select>
                <SelectTrigger
                    ref={triggerRef}
                    className="w-[300px] mb-5"
                    onClick={handleToggle}
                    aria-expanded={isOpen}
                    aria-controls="date-picker-content"
                >
                    <FaCalendar className="mr-2 h-4 w-4 text-gray-400" />
                    {date?.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                            </>
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
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={handleDateChange}
                            numberOfMonths={2}
                        />
                    </SelectContent>
                )}
            </Select>
        </div>
    )
}
