"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import type { FormElement } from "./form-builder";

interface FormElementRendererProps {
  element: FormElement;
}

export function FormElementRenderer({ element }: FormElementRendererProps) {
  const renderElement = () => {
    switch (element.type) {
      case "short-answer":
        return (
          <div className="space-y-2">
            <Label>{element.label}</Label>
            <Input placeholder="Type to answer..." />
          </div>
        );
      case "long-answer":
        return (
          <div className="space-y-2">
            <Label>{element.label}</Label>
            <Textarea placeholder="Type to answer..." />
          </div>
        );
      case "image":
        return (
          <div className="space-y-2">
            <Label>{element.label}</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-sm text-gray-500">Drag and drop image here</p>
              <button className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
                Add Image
              </button>
            </div>
          </div>
        );
      case "signature":
        return (
          <div className="space-y-2">
            <Label>{element.label}</Label>
            <div className="border rounded-lg p-8 text-center bg-gray-50">
              <p className="text-sm text-gray-500">Insert the signature here</p>
            </div>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            <Label>{element.label}</Label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox id={`${element.id}-option-${index}`} />
                  <label
                    htmlFor={`${element.id}-option-${index}`}
                    className="text-sm"
                  >
                    {option}
                  </label>
                </div>
              )) || (
                <>
                  <div className="flex items-center gap-2">
                    <Checkbox id="option-1" />
                    <label htmlFor="option-1" className="text-sm">
                      Option 1
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="option-2" />
                    <label htmlFor="option-2" className="text-sm">
                      Option 2
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case "date":
        return (
          <div className="space-y-2">
            <Label>{element.label}</Label>
            <div className="relative">
              <Input placeholder="Select a date" className="pl-10" />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        );
      case "file":
        return (
          <div className="space-y-2">
            <Label>{element.label}</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-sm text-gray-500">Drag and drop file here</p>
              <button className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
                Add File
              </button>
            </div>
          </div>
        );
      case "text":
        return <p className="text-sm">{element.label || "Text block"}</p>;
      case "headline":
        return (
          <h2 className="text-xl font-medium">{element.label || "Headline"}</h2>
        );
      default:
        return <div>Unknown element type: {element.type}</div>;
    }
  };

  return renderElement();
}
