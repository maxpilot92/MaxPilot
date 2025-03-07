"use client";

import { useState } from "react";
import { Calendar, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ScheduleGrid from "./schedule-grid";
import { AddShiftSheet, ShiftData } from "./add-shift-sheet";
import { type Shift, ShiftStatus, type StaffMember } from "@/types/schedule";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const STAFF_MEMBERS: StaffMember[] = [
  {
    id: "admin",
    name: "Admin",
    role: "Office",
    hours: 21,
  },
  {
    id: "jane-doe",
    name: "Jane Doe",
    role: "Office",
    hours: 9,
  },
  {
    id: "office-user",
    name: "Office User",
    role: "Office",
    hours: 9,
  },
];

const INITIAL_SHIFTS: Shift[] = [
  {
    id: "1",
    staffId: "admin",
    staffName: "Admin",
    date: "2024-12-02",
    startTime: "10:00",
    endTime: "17:30",
    serviceType: "Personal Care",
    status: ShiftStatus.CREATED,
  },
  {
    id: "2",
    staffId: "admin",
    staffName: "Admin",
    date: "2024-12-03",
    startTime: "10:00",
    endTime: "17:30",
    serviceType: "Personal Care",
    status: ShiftStatus.ON_LEAVE,
  },
  {
    id: "3",
    staffId: "jane-doe",
    staffName: "Jane Doe",
    date: "2024-12-04",
    startTime: "10:00",
    endTime: "17:30",
    serviceType: "Personal Care",
    status: ShiftStatus.PUBLISHED,
  },
  {
    id: "4",
    staffId: "jane-doe",
    staffName: "Jane Doe",
    date: "2024-12-05",
    startTime: "10:00",
    endTime: "17:30",
    serviceType: "Personal Care",
    status: ShiftStatus.APPROVED,
  },
  {
    id: "5",
    staffId: "office-user",
    staffName: "Office User",
    date: "2024-12-06",
    startTime: "10:00",
    endTime: "17:30",
    serviceType: "Personal Care",
    status: ShiftStatus.CANCELLED,
  },
  {
    id: "6",
    staffId: "office-user",
    staffName: "Office User",
    date: "2024-12-07",
    startTime: "10:00",
    endTime: "17:30",
    serviceType: "Personal Care",
    status: ShiftStatus.INVOICED,
  },
];

export default function SchedulePage() {
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [staff] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [dateRange] = useState("23 Dec - 29 Dec 2024");
  const [view] = useState("Weekly");
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const { toast } = useToast();

  const handleShiftMove = (
    shiftId: string,
    newDate: string,
    newStaffId: string
  ) => {
    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.id === shiftId
          ? {
              ...shift,
              date: newDate,
              staffId: newStaffId,
              staffName:
                staff.find((s) => s.id === newStaffId)?.name || shift.staffName,
            }
          : shift
      )
    );
  };

  const handleAddShift = async (data: ShiftData) => {
    console.log("New shift data:", data);
    // Handle adding the new shift here
    try {
      const response = await axios.post("/api/schedule", data);

      console.log(response);
      toast({
        title: "Success",
        description: "Shift added successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Select defaultValue="staff">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="all">All Staff</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-status">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="invoiced">Invoiced</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>

          <Button variant="outline" className="w-[200px]">
            <Calendar className="mr-2 h-4 w-4" />
            {dateRange}
          </Button>

          <Select defaultValue={view}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="default"
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => setAddShiftOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>

          <Button className="bg-teal-500 hover:bg-teal-600 text-white">
            Publish Shift
          </Button>
        </div>

        <div className="relative">
          <Input type="search" placeholder="Search" className="pl-8" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <ScheduleGrid
        shifts={shifts}
        staff={staff}
        onShiftMove={handleShiftMove}
      />
      <AddShiftSheet
        open={addShiftOpen}
        onOpenChange={setAddShiftOpen}
        onSave={handleAddShift}
      />
    </div>
  );
}
