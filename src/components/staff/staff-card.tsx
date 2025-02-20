import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { StaffData } from "@/types/staff/staff";

interface StaffCardProps {
  staff: StaffData;
  onRemove?: () => void;
  onAdd?: () => void;
  overlay?: boolean;
}

export function StaffCard({ staff, onRemove, onAdd, overlay }: StaffCardProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-2 bg-background ${
        overlay ? "cursor-grabbing" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>
            {staff.personalDetails.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">
            {staff.personalDetails.fullName}
          </p>
          <p className="text-xs text-muted-foreground">
            {staff.workDetails.role}
          </p>
        </div>
      </div>
      {onRemove && (
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-destructive/10"
        >
          <Minus className="h-4 w-4" />
        </Button>
      )}
      {onAdd && (
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd();
          }}
          className="hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
