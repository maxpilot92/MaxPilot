"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FilterParams } from "@/types/filterStaff";

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
    onApplyFilters(filters);
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
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
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
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={filters.gender}
              onValueChange={(value: "Male" | "Female") =>
                setFilters((prev) => ({ ...prev, gender: value }))
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
            </RadioGroup>
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
