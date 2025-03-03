import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function DocumentCategories() {
  const categories = [
    "ACAT Assessment",
    "Admission Documents",
    "Agreement",
    "Asthma Management Plan",
    "Behavior Management Plan",
    "Client Profile",
    "Consent to Share Information",
    "CDC Agreement",
    "Diabetes Management Plan",
    "Domestic Assistance",
    "Emergency Plan",
    "Entry Record",
    "Epilepsy Management Plan",
    "Plan Falls Risk Assessment",
    "Home Care Agreement",
    "Home Care Assessment",
    "Home Safety Checklist",
    "Intake and Referral Form",
    "Individual Risk Assessment",
    "Medication Plan",
    "NMSE AMTS",
    "NDIA Agreement",
    "NDIA Costing Document",
    "New Aged Care Arrangements",
    "Nutrition and Swallowing Plan",
    "Occupational Therapy Report",
    "PAS Assessment",
    "Personal Care Plan",
    "Power of Attorney",
    "Psychologist Report",
    "Public Guardian Document",
    "PCP Report",
    "RN Assessment",
    "Sensory Report",
    "Social Story",
    "Speech Pathologist",
    "Speech Pathologist Report",
    "Support and Respite Plan",
    "Template Daily Service Report",
    "Tube Feeding Plan",
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Client Document Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
          >
            <Pencil size={16} className="mr-1" />
            Edit
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
