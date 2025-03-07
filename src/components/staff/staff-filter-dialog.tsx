"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { FilterParams } from "@/types/filterStaff";

interface StaffFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterParams) => void;
  currentFilters: FilterParams;
}

export function StaffFilterDialog({
  open,
  onOpenChange,
  onApplyFilters,
  currentFilters,
}: StaffFilterDialogProps) {
  const [filters, setFilters] = useState<FilterParams>(currentFilters);

  const handleApply = () => {
    onApplyFilters({ ...filters, userRole: "staff" });
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterParams = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filter</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Select Role</Label>
            <Select
              value={filters.role}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Carer">Carer</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Coordinator">Coordinator</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="OfficeSupport">Office Support</SelectItem>
                <SelectItem value="Ops">Ops</SelectItem>
                <SelectItem value="Kiosk">Kiosk</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Employment Type</Label>
            <Select
              value={filters.employmentType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, employmentType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FullTime">Full Time</SelectItem>
                <SelectItem value="PartTime">Part Time</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Team</Label>
            <Select
              value={filters.team}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, team: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleClear}
          >
            Clear All
          </Button>
          <Button
            type="button"
            className="flex-1 bg-[#0D894F] hover:bg-[#0D894F]/90"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
