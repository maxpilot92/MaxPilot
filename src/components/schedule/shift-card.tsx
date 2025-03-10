"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Check, Lock } from "lucide-react";
import { type Shift, ShiftStatus } from "@/types/schedule";
import { format } from "date-fns";

interface ShiftCardProps {
  shift: Shift;
}

export default function ShiftCard({ shift }: ShiftCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: shift.id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const getBackgroundColor = (status: ShiftStatus) => {
    switch (status) {
      case ShiftStatus.CREATED:
        return "bg-gray-100";
      case ShiftStatus.PUBLISHED:
        return "bg-cyan-100";
      case ShiftStatus.APPROVED:
        return "bg-orange-100";
      case ShiftStatus.CANCELLED:
        return "bg-yellow-100";
      case ShiftStatus.ON_LEAVE:
        return "bg-red-100";
      case ShiftStatus.INVOICED:
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      // If it's already in HH:MM format, convert to 12-hour format
      if (timeString.includes(":")) {
        const [hours, minutes] = timeString.split(":");
        const date = new Date();
        date.setHours(Number.parseInt(hours, 10));
        date.setMinutes(Number.parseInt(minutes, 10));
        return format(date, "h:mm a");
      }
      return timeString;
    } catch (error) {
      console.log(error);
      return timeString;
    }
  };

  const startTimeFormatted = formatTime(shift.startTime);
  const endTimeFormatted = formatTime(shift.endTime);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`mb-2 p-2 rounded-md cursor-grab active:cursor-grabbing ${getBackgroundColor(
        shift.status
      )}`}
    >
      <div className="text-sm font-medium">
        {startTimeFormatted} - {endTimeFormatted}
      </div>
      <div className="text-xs text-gray-600">
        {shift.serviceType || shift.shiftType || "Personal Care"}
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className="text-sm">{shift.carerName || "Staff"}</div>
        <div className="flex items-center space-x-1">
          {(shift.status === ShiftStatus.APPROVED ||
            shift.status === ShiftStatus.INVOICED) && (
            <Check className="h-4 w-4 text-green-600" />
          )}
          {shift.status === ShiftStatus.INVOICED && (
            <Lock className="h-4 w-4 text-blue-600" />
          )}
        </div>
      </div>
    </div>
  );
}
