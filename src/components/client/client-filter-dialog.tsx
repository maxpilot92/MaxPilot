"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import axios from "axios";

export interface FilterParams {
  gender?: string;
  maritalStatus?: string;
  clientStatus?: string;
  unit?: string;
  userRole?: string;
}
interface ClientFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterParams) => void;
  currentFilters: FilterParams;
}

export function ClientFilterDialog({
  open,
  onOpenChange,
  onApplyFilters,
  currentFilters,
}: ClientFilterDialogProps) {
  const [gender, setGender] = useState<string | undefined>(
    currentFilters.gender
  );
  const [maritalStatus, setMaritalStatus] = useState<string | undefined>(
    currentFilters.maritalStatus
  );
  const [clientStatus, setClientStatus] = useState<string | undefined>(
    currentFilters.clientStatus
  );
  const [unit, setUnit] = useState<string | undefined>(currentFilters.unit);
  const [units, setUnits] = useState<string[]>([]);

  // Fetch units for dropdown
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get("/api/units");
        setUnits(response.data.data);
      } catch (error) {
        console.error("Error fetching units:", error);
        setUnits([]);
      }
    };

    if (open) {
      fetchUnits();
    }
  }, [open]);

  const handleApply = () => {
    const newFilters: FilterParams = {};
    if (gender) newFilters.gender = gender;
    if (maritalStatus) newFilters.maritalStatus = maritalStatus;
    if (clientStatus) newFilters.clientStatus = clientStatus;
    if (unit) newFilters.unit = unit;

    onApplyFilters(newFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setGender(undefined);
    setMaritalStatus(undefined);
    setClientStatus(undefined);
    setUnit(undefined);

    onApplyFilters({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Clients</DialogTitle>
          <DialogDescription>
            Apply filters to narrow down your client list.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender" className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maritalStatus" className="text-right">
              Marital Status
            </Label>
            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
              <SelectTrigger id="maritalStatus" className="col-span-3">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
                <SelectItem value="Separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientStatus" className="text-right">
              Client Status
            </Label>
            <Select value={clientStatus} onValueChange={setClientStatus}>
              <SelectTrigger id="clientStatus" className="col-span-3">
                <SelectValue placeholder="Select client status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Former">Former</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unit
            </Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit" className="col-span-3">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
