"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Shift } from "@/types/schedule";
import ShiftCard from "./shift-card";

interface ScheduleCellProps {
  id: string;
  shifts: Shift[];
}

export default function ScheduleCell({ id, shifts }: ScheduleCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] p-2 border-r last:border-r-0 ${
        isOver ? "bg-gray-50" : ""
      }`}
    >
      {shifts && shifts.length > 0
        ? shifts.map((shift) => <ShiftCard key={shift.id} shift={shift} />)
        : null}
    </div>
  );
}
