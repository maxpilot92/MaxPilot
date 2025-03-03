"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

interface AddHeadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (heading: { name: string; message: string }) => void;
}

export default function AddHeadingDialog({
  open,
  onOpenChange,
  onAdd,
}: AddHeadingDialogProps) {
  const [selectedHeading, setSelectedHeading] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    if (!selectedHeading) return;
    onAdd({ name: selectedHeading, message });
    setSelectedHeading("");
    setMessage("");
    onOpenChange(false);
  };

  const headingOptions = [
    "Progress Notes",
    "Medical History",
    "Treatment Plan",
    "Assessment Results",
    "Care Instructions",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Add New Heading</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Select Option</label>
              <Select
                value={selectedHeading}
                onValueChange={setSelectedHeading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Heading Name" />
                </SelectTrigger>
                <SelectContent>
                  {headingOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Enter additional message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-teal-500 text-white hover:bg-teal-600"
          >
            Add Heading
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
