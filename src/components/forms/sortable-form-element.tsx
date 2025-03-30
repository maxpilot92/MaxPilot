"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { FormElementRenderer } from "./form-element-renderer";
import type { FormElement } from "./form-builder";

interface SortableFormElementProps {
  element: FormElement;
}

export function SortableFormElement({ element }: SortableFormElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // Make completely invisible when dragging
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg bg-white ${
        isDragging ? "opacity-0 border-teal-500 shadow-lg" : ""
      }`}
    >
      <div className="flex items-start p-4">
        <div
          className="p-1 mr-2 cursor-move hover:bg-gray-100 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <FormElementRenderer element={element} />
        </div>
      </div>
    </div>
  );
}
