"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Check, Lock } from "lucide-react";
import { type Shift, ShiftStatus } from "@/types/schedule";

interface ShiftCardProps {
  shift: Shift;
}

export default function ShiftCard({ shift }: ShiftCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: shift.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

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
      <div className="text-sm font-medium">10 AM - 5:30 PM</div>
      <div className="text-xs text-gray-600">{shift.serviceType}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="text-sm">{shift.staffName}</div>
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
