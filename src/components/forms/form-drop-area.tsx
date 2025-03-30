"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableFormElement } from "./sortable-form-element";
import type { FormElement } from "./form-builder";

interface FormDropAreaProps {
  elements: FormElement[];
}

export function FormDropArea({ elements }: FormDropAreaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-drop-area",
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-full min-h-[500px] rounded-lg p-4 transition-colors ${
        isOver
          ? "bg-teal-50 border-2 border-dashed border-teal-500"
          : elements.length === 0
          ? "border-2 border-dashed border-gray-200"
          : "border border-gray-200"
      }`}
      style={{
        height: elements.length ? "auto" : "500px",
        minHeight: "500px",
      }}
    >
      {elements.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          Drag and drop form elements here
        </div>
      ) : (
        <div className="space-y-4">
          {elements.map((element) => (
            <SortableFormElement key={element.id} element={element} />
          ))}
        </div>
      )}
    </div>
  );
}
