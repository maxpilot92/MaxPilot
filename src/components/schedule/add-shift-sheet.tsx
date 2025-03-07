"use client";

import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStaff } from "@/hooks/use-staff";
import { StaffData } from "@/types/staff/staff";

interface AddShiftSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ShiftData) => void;
}

export interface ShiftData {
  carerId?: string;
  clientId?: string;
  payGroup?: string;
  priceBook?: string;
  funds?: string;
  shiftType?: string;
  additionalShiftType?: string;
  allowance?: string;
}

export function AddShiftSheet({
  open,
  onOpenChange,
  onSave,
}: AddShiftSheetProps) {
  const [addToJobBoard, setAddToJobBoard] = useState(false);
  const [notifyCarer, setNotifyCarer] = useState(false);
  const [clients, setClients] = useState<StaffData[]>();
  const [carers, setCarers] = useState<StaffData[]>();
  const [formData, setFormData] = useState<ShiftData>({
    carerId: "",
    clientId: "",
    payGroup: "",
    priceBook: "",
    funds: "",
    shiftType: "",
    additionalShiftType: "",
    allowance: "",
  });
  const clientResponse = useStaff({ userRole: "client" });
  const carerResponse = useStaff({ userRole: "staff" });

  useEffect(() => {
    async function getUsers() {
      try {
        const clientData = await clientResponse;
        const carerData = await carerResponse;
        setCarers(carerData);
        setClients(clientData);
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, []);

  const handleSave = () => {
    // Only include properties that match the Shift schema
    const shiftData = {
      carerId: formData.carerId,
      clientId: formData.clientId,
      payGroup: formData.payGroup,
      priceBook: formData.priceBook,
      funds: formData.funds,
      shiftType: formData.shiftType,
      additionalShiftType: formData.additionalShiftType,
      allowance: formData.allowance,
    };

    onSave(shiftData);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] p-0">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Advanced Edit
            </Button>
            <Button
              onClick={handleSave}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Save Shift
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-8 h-[calc(100vh-80px)] overflow-y-auto">
          {/* Carer Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Carer</h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="job-board" className="text-sm text-gray-500">
                  Add to Job Board
                </Label>
                <Switch
                  id="job-board"
                  checked={addToJobBoard}
                  onCheckedChange={setAddToJobBoard}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Carer Name</Label>
                <Select
                  value={formData.carerId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, carerId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a carer" />
                  </SelectTrigger>
                  <SelectContent>
                    {carers?.map((carer) => (
                      <SelectItem key={carer.id} value={carer.id}>
                        {carer.personalDetails.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="notify"
                  checked={notifyCarer}
                  onCheckedChange={(checked) =>
                    setNotifyCarer(checked as boolean)
                  }
                />
                <Label htmlFor="notify">Notify Carer</Label>
              </div>

              <div className="space-y-2">
                <Label>Choose Pay Group</Label>
                <Select
                  value={formData.payGroup}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, payGroup: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Use staff member's default pay group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Pay Group</SelectItem>
                    <SelectItem value="custom">Custom Pay Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Client Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Choose Client</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, clientId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.personalDetails.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Book</Label>
                <Select
                  value={formData.priceBook}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, priceBook: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search Price Book" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book1">Price Book 1</SelectItem>
                    <SelectItem value="book2">Price Book 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Funds</Label>
                <Select
                  value={formData.funds}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, funds: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search Funds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fund1">Fund 1</SelectItem>
                    <SelectItem value="fund2">Fund 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Shift Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shift</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Shift Type</Label>
                <Select
                  value={formData.shiftType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, shiftType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Personal Care" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Care</SelectItem>
                    <SelectItem value="medical">Medical Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Shift Type</Label>
                <Select
                  value={formData.additionalShiftType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      additionalShiftType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">Type 1</SelectItem>
                    <SelectItem value="type2">Type 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Allowance</Label>
                <Select
                  value={formData.allowance}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, allowance: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow1">Allowance 1</SelectItem>
                    <SelectItem value="allow2">Allowance 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
