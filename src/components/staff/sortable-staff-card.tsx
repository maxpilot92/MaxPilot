import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { StaffCard } from "./staff-card";
import type { StaffData } from "@/types/staff/staff";

interface SortableStaffCardProps {
  staff: StaffData;
  onRemove?: () => void;
  onAdd?: () => void;
}

export function SortableStaffCard({
  staff,
  onRemove,
  onAdd,
}: SortableStaffCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: staff.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <StaffCard staff={staff} onRemove={onRemove} onAdd={onAdd} />
    </div>
  );
}
