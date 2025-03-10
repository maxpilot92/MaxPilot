"use client";

import { useState, useEffect } from "react";
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
import { AddShiftSheet, type ShiftData } from "./add-shift-sheet";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, subMonths } from "date-fns";

export default function SchedulePage() {
  const [dateRange, setDateRange] = useState(
    format(new Date(), "dd MMM - dd MMM yyyy")
  );
  const [view, setView] = useState("Weekly");
  const [addShiftOpen, setAddShiftOpen] = useState(false);
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Use the updated useStaff hook
  // const { data: staff, loading: staffLoading } = useStaff({
  //   userRole: "staff",
  // });

  // Update date range when month changes
  useEffect(() => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    setDateRange(
      `${format(startOfMonth, "dd MMM")} - ${format(endOfMonth, "dd MMM yyyy")}`
    );
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleShiftMove = async (
    shiftId: string,
    newDate: string,
    newStaffId: string
  ) => {
    try {
      // Update the shift in the backend
      await axios.patch(`/api/schedule/${shiftId}`, {
        date: newDate,
        carerId: newStaffId,
      });

      toast({
        title: "Success",
        description: "Shift moved successfully",
      });
    } catch (error) {
      console.error("Error moving shift:", error);
      toast({
        title: "Error",
        description: "Failed to move shift",
        variant: "destructive",
      });
    }
  };

  const handleAddShift = async (data: ShiftData) => {
    try {
      await axios.post("/api/schedule", data);

      toast({
        title: "Success",
        description: "Shift added successfully",
      });

      setAddShiftOpen(false);
    } catch (error) {
      console.error("Error adding shift:", error);
      toast({
        title: "Error",
        description: "Failed to add shift",
        variant: "destructive",
      });
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

          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              &lt;
            </Button>
            <Button variant="outline" className="mx-1 w-[200px]">
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange}
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              &gt;
            </Button>
          </div>

          <Select value={view} onValueChange={setView}>
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

      <ScheduleGrid onShiftMove={handleShiftMove} />

      <AddShiftSheet
        open={addShiftOpen}
        onOpenChange={setAddShiftOpen}
        onSave={handleAddShift}
      />
    </div>
  );
}
