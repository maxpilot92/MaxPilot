"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  AlignLeft,
  CheckSquare,
  Calendar,
  Upload,
  ImageIcon,
  Pen,
  Type,
  Heading,
} from "lucide-react";

const FORM_ELEMENTS = [
  {
    id: "short-answer",
    icon: Type,
    label: "Short Answer",
    type: "short-answer",
  },
  {
    id: "long-answer",
    icon: AlignLeft,
    label: "Long Answer",
    type: "long-answer",
  },
  {
    id: "image",
    icon: ImageIcon,
    label: "Image",
    type: "image",
  },
  {
    id: "signature",
    icon: Pen,
    label: "Signature",
    type: "signature",
  },
  {
    id: "checkbox",
    icon: CheckSquare,
    label: "Checkbox",
    type: "checkbox",
  },
  {
    id: "date",
    icon: Calendar,
    label: "Date Input",
    type: "date",
  },
  {
    id: "file",
    icon: Upload,
    label: "File Upload",
    type: "file",
  },
  {
    id: "text",
    icon: Type,
    label: "Text",
    type: "text",
  },
  {
    id: "headline",
    icon: Heading,
    label: "Headline",
    type: "headline",
  },
];

function DraggableElement({
  id,
  icon: Icon,
  label,
  type,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  type: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: {
        type,
        label,
      },
    });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0 : 1, // Make completely invisible when dragging
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 border rounded-md mb-2 bg-white cursor-move hover:border-teal-500 hover:bg-teal-50 transition-colors ${
        isDragging ? "opacity-0 border-teal-500" : ""
      }`}
    >
      <Icon className="h-4 w-4 text-gray-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function FormElements() {
  return (
    <div className="space-y-2">
      {FORM_ELEMENTS.map((element) => (
        <DraggableElement key={element.id} {...element} />
      ))}
    </div>
  );
}
