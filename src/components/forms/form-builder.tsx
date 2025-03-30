"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  pointerWithin, // Change from closestCenter to pointerWithin
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { FormElements } from "./form-elements";
import { FormDropArea } from "./form-drop-area";
import { FormElementRenderer } from "./form-element-renderer";

export interface FormElement {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
}

export function FormBuilder({
  elements,
  setElements,
}: {
  elements: FormElement[];
  setElements: (elements: FormElement[]) => void;
}) {
  const [activeElement, setActiveElement] = useState<FormElement | null>(null);

  // Configure sensors for better drag detection
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 8 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Check if this is an existing form element being dragged
    const draggedElement = elements.find((el) => el.id === active.id);

    if (draggedElement) {
      // If dragging an existing element, use its data
      setActiveElement(draggedElement);
    } else if (active.data?.current) {
      // If dragging from sidebar, create a new element data
      setActiveElement({
        id: active.id as string,
        type: active.data.current.type,
        label: active.data.current.label,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveElement(null);

    // If dropped over the drop area
    if (over && over.id === "form-drop-area" && active.data?.current) {
      // This is a new element from the sidebar
      const newElement: FormElement = {
        id: `${active.data.current.type}-${Date.now()}`,
        type: active.data.current.type,
        label: active.data.current.label,
        required: false,
      };

      // Add checkbox options if it's a checkbox element
      if (newElement.type === "checkbox") {
        newElement.options = ["Option 1", "Option 2", "Option 3"];
      }

      // Add the new element to the form
      setElements([...elements, newElement]);
    }
    // If this is reordering existing elements
    else if (over && active.id !== over.id) {
      // Find the indices of the dragged item and the drop target
      const activeIndex = elements.findIndex((el) => el.id === active.id);
      const overIndex = elements.findIndex((el) => el.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        // Reorder the elements array
        setElements(arrayMove(elements, activeIndex, overIndex));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveElement(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin} // Changed from closestCenter
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-116px)]">
        {/* Form Elements Sidebar */}
        <div className="bg-white border-r p-4 overflow-y-auto">
          <div className="font-medium mb-4">Form Elements</div>
          <FormElements />
        </div>

        {/* Form Building Area */}
        <div className="p-6 overflow-y-auto">
          <SortableContext
            items={elements.map((el) => el.id)}
            strategy={verticalListSortingStrategy}
          >
            <FormDropArea elements={elements} />
          </SortableContext>
        </div>
      </div>

      {/* Drag Overlay - Shows what's being dragged */}
      <DragOverlay>
        {activeElement && (
          <div className="p-4 border rounded-lg bg-white shadow-lg opacity-80 w-[300px]">
            <FormElementRenderer element={activeElement} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
