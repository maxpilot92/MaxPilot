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
import type { Shift } from "@/types/schedule";
import ScheduleCell from "./schedule-cell";
import { useStaff } from "@/hooks/use-staff";
import { useEffect, useState } from "react";
import axios from "axios";
import { format, addDays, startOfWeek } from "date-fns";

interface ScheduleGridProps {
  onShiftMove: (shiftId: string, newDate: string, newStaffId: string) => void;
}

export default function ScheduleGrid({ onShiftMove }: ScheduleGridProps) {
  const {
    data: staff,
    loading: staffLoading,
    error: staffError,
  } = useStaff({ userRole: "staff" });
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [days, setDays] = useState<
    { number: number; name: string; date: string }[]
  >([]);

  // Generate dynamic days for the current week
  useEffect(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 }); // 0 = Sunday

    const weekDays = Array.from({ length: 7 }).map((_, index) => {
      const day = addDays(startOfCurrentWeek, index);
      return {
        number: day.getDate(),
        name: format(day, "EEE").toUpperCase(),
        date: format(day, "yyyy-MM-dd"),
      };
    });

    setDays(weekDays);
  }, []);

  useEffect(() => {
    const getShifts = async () => {
      try {
        const response = await axios.get("/api/schedule");
        setShifts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };
    getShifts();
  }, []);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
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

  if (days.length === 0 || staffLoading) {
    return <div className="p-4 text-center">Loading schedule...</div>;
  }

  if (staffError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading staff: {staffError.message}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="border rounded-lg bg-white">
        {/* Header */}
        <div className="grid grid-cols-[200px_1fr] border-b">
          <div className="p-4 border-r font-medium">Job Board</div>
          <div className="grid grid-cols-7">
            {days.map((day) => (
              <div
                key={day.date}
                className="p-4 text-center border-r last:border-r-0"
              >
                <div className="font-medium">{day.number}</div>
                <div className="text-sm text-gray-500">{day.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Rows */}
        {staff && staff.length > 0 ? (
          staff.map((person) => (
            <div
              key={person.id}
              className="grid grid-cols-[200px_1fr] border-b last:border-b-0"
            >
              {/* Staff Info */}
              <div className="p-4 border-r flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback>
                    {person.personalDetails?.fullName
                      ? person.personalDetails.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">
                    {person.personalDetails?.fullName || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {person.role || "Staff"}
                  </div>
                </div>
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const cellId = `${day.date}|${person.id}`;
                  shifts.filter((shift) => person.id !== shift.id);
                  const cellShifts = shifts.filter(
                    (shift) =>
                      // shift.date === day.date && shift.carerId === person.id
                      shift.carerId === person.id
                  );

                  return (
                    <ScheduleCell
                      key={cellId}
                      id={cellId}
                      shifts={cellShifts}
                    />
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No staff members found
          </div>
        )}
      </div>
    </DndContext>
  );
}
