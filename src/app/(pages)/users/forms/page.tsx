"use client";

import { useState } from "react";
import { Search, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/domain";

const FORM_TEMPLATES = [
  "Progress Report",
  "SIL House End of Month Tasks",
  "NDIS Service Agreement",
  "Incident Report",
  "Participant Seizure Recording Chart",
  "Medication Incident Report",
  "Client Assessment",
  "Staff Training Record",
  "Risk Assessment",
  "Behavior Support Plan",
  "Medication Chart",
  "Daily Progress Notes",
  "Client Feedback",
  "Service Delivery Record",
];

export default function NewFormPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredTemplates = FORM_TEMPLATES.filter((template) =>
    template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTemplates = filteredTemplates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Forms</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>List</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-teal-600">New Form</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Custom Form Card */}
        <div className="border rounded-md p-6">
          <h2 className="text-xl font-medium mb-3">Create a Custom Form</h2>
          <p className="text-gray-600 mb-6">
            Create and customize your form from scratch based on your
            requirement.
          </p>
          <Button
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => router.push(`${BASE_URL}/users/forms/builder`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Button>
        </div>

        {/* Choose Template Section */}
        <div className="border rounded-md p-6">
          <h2 className="text-xl font-medium mb-4">Choose a template</h2>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search template"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>

          {/* Templates List */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-600">
              Available Templates
            </div>
            <div className="divide-y">
              {displayedTemplates.map((template, index) => (
                <div
                  key={index}
                  className="py-3 hover:bg-gray-50 cursor-pointer"
                >
                  {template}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredTemplates.length)}{" "}
                from {filteredTemplates.length}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage === 1) {
                    pageNum = i + 1;
                  } else if (currentPage === totalPages) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }

                  return (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={`h-8 w-8 ${
                        pageNum === currentPage
                          ? "bg-teal-500 text-white hover:bg-teal-600"
                          : ""
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
