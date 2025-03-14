"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    setSelectedDate(date);
    setIsOpen(false);
  };

  const handleOk = () => {
    onSelect?.(selectedDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span className="text-red-500 cursor-pointer">Empty</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="bg-[#F0F9F6] p-3">
          <div className="text-sm">
            {/* {format(selectedDate || new Date(), "MMMM yyyy")} */}
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
