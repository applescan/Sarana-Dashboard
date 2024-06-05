import * as React from "react";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./Popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./Select";
import Button from "./Button";
import { FaCalendarAlt } from "react-icons/fa";
import { useEffect } from "react";

interface DatePickerWithPresetsProps {
    selectedDate: Date | null;
    onDateChange: (date: Date) => void;
}

export function DatePickerWithPresets({ selectedDate, onDateChange }: DatePickerWithPresetsProps) {
    const [date, setDate] = React.useState<Date | undefined>(selectedDate ?? undefined);

    useEffect(() => {
        if (date) {
            onDateChange(date);
        }
    }, [date]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline-primary"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <FaCalendarAlt className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                    onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    <FaCalendarAlt mode="single" selected={date} onSelect={setDate} />
                </div>
            </PopoverContent>
        </Popover>
    );
}
