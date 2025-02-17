"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ArchiveAll({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className={cn(
                "flex-1 bg-red-600 text-white hover:bg-red-700",
                "focus-visible:ring-red-600"
              )}
              onClick={onConfirm}
            >
              Archive All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
