"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Heading {
  id: string;
  needToKnowInfo?: string;
  usefulInfo?: string;
  needToKnowMandatory?: boolean;
  usefulInfoMandatory?: boolean;
}

interface AddNewHeadingDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  shouldUpdate: boolean;
  onSuccess: () => void;
}

export function AddNewHeadingDialog({
  open,
  title,
  onOpenChange,
  userId,
  shouldUpdate,
  onSuccess,
}: AddNewHeadingDialogProps) {
  const [heading, setHeading] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [needToKnowInfos, setNeedToKnowInfos] = useState<Heading[]>([]);
  const [usefulInfos, setUsefulInfos] = useState<Heading[]>([]);
  const [isNTKDialog, setIsNTKDialog] = useState<boolean>(false);
  const { toast } = useToast();
  const fetchHeadings = async () => {
    try {
      if (isNTKDialog) {
        const response = await axios.get(
          "/api/user/client/heading?headingType=needToKnowInfo"
        );
        setNeedToKnowInfos(response.data.data || []);
      } else {
        const response = await axios.get(
          "/api/user/client/heading?headingType=usefullInfo"
        );
        setUsefulInfos(response.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching headings:", error);
    }
  };
  // Set the dialog type based on the title prop
  useEffect(() => {
    setIsNTKDialog(title === "needToKnowInfo");
    fetchHeadings();
    // Reset heading when dialog type changes
  }, [title]);

  // Fetch headings based on dialog type
  useEffect(() => {
    if (open) {
      fetchHeadings();
    }
  }, [isNTKDialog, open]);

  const handleAddHeadingInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `/api/user/client/public-information?userId=${userId}`;
      const payload = isNTKDialog
        ? { needToKnowInfo: { heading, description: message } }
        : { usefulInfo: { heading, description: message } };
      // Check if we have existing public information
      if (shouldUpdate) {
        console.log("Public information already exists");
        await axios.put(url, payload);
        onOpenChange(false); // Close dialog
        onSuccess(); // Call the callback to refresh parent
        toast({
          title: "Success",
          description: "Public information updated successfully",
        });
      } else {
        // handle post api call
        await axios.post(url, payload);
        onOpenChange(false); // Close dialog
        onSuccess(); // Call the callback to refresh parent
        toast({
          title: "Success",
          description: "Public information saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving general information:", error);
      toast({
        title: "Failed to save general information",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Determine the options to show based on the dialog type
  const headingOptions = isNTKDialog ? needToKnowInfos : usefulInfos;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-semibold">
            Add New {isNTKDialog ? "Need to Know" : "Useful Info"} Heading
          </h2>
        </div>

        <form onSubmit={handleAddHeadingInfo} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Select Option</label>
            <Select value={heading} onValueChange={setHeading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Heading Name" />
              </SelectTrigger>
              <SelectContent>
                {headingOptions.length > 0 ? (
                  headingOptions.map((option) => (
                    <SelectItem
                      key={option.id}
                      value={
                        isNTKDialog && option.needToKnowInfo
                          ? option.needToKnowInfo
                          : option.usefulInfo || ""
                      }
                    >
                      {isNTKDialog ? option.needToKnowInfo : option.usefulInfo}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-options" disabled>
                    No options available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter additional message"
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              disabled={!heading}
            >
              Add Heading
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
