"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "./date-picker";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface CreateFundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FundData {
  name: string;
  starts: Date | undefined;
  expires: Date | undefined;
  amount: number;
  isDefault: boolean;
}

export function CreateFundDialog({
  open,
  onOpenChange,
}: CreateFundDialogProps) {
  const [formData, setFormData] = useState<FundData>({
    name: "",
    starts: undefined,
    expires: undefined,
    amount: 0,
    isDefault: false,
  });

  const { toast } = useToast();
  const url = window.location.href;
  const clientId = url.substring(url.lastIndexOf("/") + 1);

  const handleSave = async () => {
    try {
      console.log(formData);
      const response = await axios.post(
        `/api/user/client/fund?clientId=${clientId}`,
        formData
      );
      console.log(response.data);
      toast({
        title: "Fund created successfully",
        description: "The fund has been created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "An error occurred while creating the fund",
        variant: "destructive",
      });
    }
    onOpenChange(false);
  };

  const formatAmount = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = numericValue.split(".");
    if (parts.length > 2) return formData.amount.toFixed(2);
    // Limit to 2 decimal places
    if (parts[1]?.length > 2) return formData.amount.toFixed(2);
    return numericValue;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle />
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Fund</h2>\{" "}
        </div>

        <div className="p-0">
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-4 bg-[#F0F9F6] p-4 text-sm font-medium">
            <div>Name</div>
            <div>Starts</div>
            <div>Expires</div>
            <div>Amount</div>
            <div>Balance</div>
            <div>Default</div>
          </div>

          {/* Input Row */}
          <div className="grid grid-cols-6 gap-4 p-4">
            <div>
              <Input
                placeholder="Enter Fund Type"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <DatePicker
                date={formData.starts}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, starts: date }))
                }
              />
            </div>
            <div>
              <DatePicker
                date={formData.expires}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, expires: date }))
                }
              />
            </div>
            <div>
              <Input
                placeholder="Enter Amount"
                value={formData.amount > 0 ? formData.amount.toString() : ""}
                onChange={(e) => {
                  const value = formatAmount(e.target.value);
                  setFormData((prev) => ({ ...prev, amount: Number(value) }));
                }}
                className="text-right"
              />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-sm">${formData.amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-center">
              <Checkbox
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefault: checked as boolean,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
