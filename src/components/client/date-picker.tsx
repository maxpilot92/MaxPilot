"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react"; // Import an icon for the button
import { format, isValid } from "date-fns"; // Import date-fns for formatting and validation

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleCancel = () => {
    setSelectedDate(date); // Reset to the original date
    setIsOpen(false); // Close the popover
  };

  const handleOk = () => {
    onSelect?.(selectedDate); // Pass the selected date to the parent component
    setIsOpen(false); // Close the popover
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate && isValid(selectedDate)
            ? format(selectedDate, "PPP") // Format the date if it's valid
            : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="bg-[#F0F9F6] p-3">
          <div className="text-sm">
            {selectedDate && isValid(selectedDate)
              ? format(selectedDate, "MMMM yyyy") // Format the date if it's valid
              : "Select a date"}
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
          className="border-0"
        />
        <div className="flex items-center justify-end gap-2 p-3 border-t">
          <Button
            variant="ghost"
            className="text-sm h-8"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-sm h-8"
            onClick={handleOk}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
