import * as React from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { FaCalendar } from "react-icons/fa6"
import { Calendar } from "./Calendar"
import { Select, SelectContent, SelectTrigger } from "./Select"
import { useEffect, useRef, useState } from "react"
import { Badge } from "./Badge"

interface DatePickerWithRangeProps {
    className?: string
    selectedDate: DateRange | undefined
    onDateChange: (date: DateRange | undefined) => void
    isRange: boolean
}

export function DatePickerWithRange({
    className,
    selectedDate,
    onDateChange,
    isRange
}: DatePickerWithRangeProps) {
    const today = new Date()
    const defaultDateRange = { from: today, to: today }

    const [date, setDate] = useState<DateRange | undefined>(selectedDate || defaultDateRange)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        setDate(selectedDate || defaultDateRange)
    }, [selectedDate])

    const handleDateChange = (newDate: DateRange) => {
        if (newDate) {
            if (!isRange) {
                const singleDate = newDate.from
                setDate({ from: singleDate, to: singleDate })
                onDateChange({ from: singleDate, to: singleDate })
            } else {
                setDate(newDate)
                onDateChange(newDate)
            }
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
        setSelectedPreset(preset)
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
                            {isRange && (<div className="flex space-x-2 mb-2 justify-center">
                                <Badge onClick={() => handlePreset('today')} variant={selectedPreset === 'today' ? "default" : "secondary"} className="cursor-pointer">Today</Badge>
                                <Badge onClick={() => handlePreset('thisWeek')} variant={selectedPreset === 'thisWeek' ? "default" : "secondary"} className="cursor-pointer">This Week</Badge>
                                <Badge onClick={() => handlePreset('thisMonth')} variant={selectedPreset === 'thisMonth' ? "default" : "secondary"} className="cursor-pointer">This Month</Badge>
                                <Badge onClick={() => handlePreset('thisYear')} variant={selectedPreset === 'thisYear' ? "default" : "secondary"} className="cursor-pointer">This Year</Badge>
                            </div>)}
                            <div className="rounded-md border">
                                <Calendar
                                    initialFocus
                                    mode={isRange ? "range" : "single"}
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={(range) => {
                                        if (range) {
                                            handleDateChange(isRange ? range : { from: range, to: range })
                                        }
                                    }}
                                    numberOfMonths={2}
                                    disabled={{ after: today }}
                                />
                            </div>
                        </div>
                    </SelectContent>
                )}
            </Select>
        </div>
    )
}
