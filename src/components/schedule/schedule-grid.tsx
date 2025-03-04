"use client";

import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Shift, StaffMember } from "@/types/schedule";
import ScheduleCell from "./schedule-cell";

interface ScheduleGridProps {
  shifts: Shift[];
  staff: StaffMember[];
  onShiftMove: (shiftId: string, newDate: string, newStaffId: string) => void;
}

const DAYS = [
  { number: 2, name: "SUN", date: "2024-12-02" },
  { number: 3, name: "MON", date: "2024-12-03" },
  { number: 4, name: "TUE", date: "2024-12-04" },
  { number: 5, name: "WED", date: "2024-12-05" },
  { number: 6, name: "THU", date: "2024-12-06" },
  { number: 7, name: "FRI", date: "2024-12-07" },
  { number: 8, name: "SAT", date: "2024-12-08" },
];

export default function ScheduleGrid({
  shifts,
  staff,
  onShiftMove,
}: ScheduleGridProps) {
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const shiftId = active.id as string;
      const [newDate, newStaffId] = (over.id as string).split("|");

      onShiftMove(shiftId, newDate, newStaffId);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="border rounded-lg bg-white">
        {/* Header */}
        <div className="grid grid-cols-[200px_1fr] border-b">
          <div className="p-4 border-r font-medium">Job Board</div>
          <div className="grid grid-cols-7">
            {DAYS.map((day) => (
              <div
                key={day.number}
                className="p-4 text-center border-r last:border-r-0"
              >
                <div className="font-medium">{day.number}</div>
                <div className="text-sm text-gray-500">{day.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Rows */}
        {staff.map((person) => (
          <div
            key={person.id}
            className="grid grid-cols-[200px_1fr] border-b last:border-b-0"
          >
            {/* Staff Info */}
            <div className="p-4 border-r flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{person.name}</div>
                <div className="text-xs text-gray-500">
                  {person.hours} Hours
                </div>
              </div>
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7">
              {DAYS.map((day) => {
                const cellId = `${day.date}|${person.id}`;
                const cellShifts = shifts.filter(
                  (shift) =>
                    shift.date === day.date && shift.staffId === person.id
                );

                return (
                  <ScheduleCell key={cellId} id={cellId} shifts={cellShifts} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
