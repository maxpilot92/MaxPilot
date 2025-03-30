"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormBuilder, FormElement } from "@/components/forms/form-builder";
import axios from "axios";

export default function FormBuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("questions");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [elements, setElements] = useState<FormElement[]>([]);

  const handleFormSubmit = async () => {
    // Submit form data to the server
    console.log(elements);

    try {
      const response = await axios.post("/api/form", elements);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-medium">Form: </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="template"
                checked={saveAsTemplate}
                onCheckedChange={(checked) => setSaveAsTemplate(!!checked)}
              />
              <label htmlFor="template" className="text-sm">
                Save Form as Template
              </label>
            </div>
            <Button
              onClick={handleFormSubmit}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Save
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="bg-[#F0F9F6] p-1 h-12 w-full grid grid-cols-2">
            <TabsTrigger
              value="questions"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="recipients"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              Select Recipients
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <FormBuilder elements={elements} setElements={setElements} />
    </div>
  );
}
