"use client";

import { useDroppable } from "@dnd-kit/core";
import ShiftCard from "./shift-card";
import { Shift } from "@/types/schedule";

interface DayColumnProps {
  date: string;
  shifts: Shift[];
}

export default function DayColumn({ date, shifts }: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: date,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] p-4 border-r last:border-r-0 ${
        isOver ? "bg-gray-50" : ""
      }`}
    >
      {shifts.map((shift) => (
        <ShiftCard key={shift.id} shift={shift} />
      ))}
    </div>
  );
}
