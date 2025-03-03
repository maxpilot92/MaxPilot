"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ManageDialog, { type Heading } from "./manage-dialog";

export default function ClientInformation({ userId }: { userId: string }) {
  const [needToKnowDialogOpen, setNeedToKnowDialogOpen] = useState(false);
  const [usefulInfoDialogOpen, setUsefulInfoDialogOpen] = useState(false);

  const [needToKnowHeadings, setNeedToKnowHeadings] = useState<Heading[]>([
    { id: "ntk-1", name: "Allergies", mandatory: true },
    { id: "ntk-2", name: "Medications", mandatory: true },
  ]);

  const [usefulInfoHeadings, setUsefulInfoHeadings] = useState<Heading[]>([
    { id: "ui-1", name: "Preferences", mandatory: false },
    { id: "ui-2", name: "Family Contacts", mandatory: true },
  ]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">
          Client Public Information Headings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Need to know information
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              onClick={() => setNeedToKnowDialogOpen(true)}
            >
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Useful Information
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              onClick={() => setUsefulInfoDialogOpen(true)}
            >
              Manage
            </Button>
          </div>
        </div>
      </div>

      <ManageDialog
        title="Need to know information"
        userId={userId}
        open={needToKnowDialogOpen}
        onOpenChange={setNeedToKnowDialogOpen}
        headings={needToKnowHeadings}
        onSave={setNeedToKnowHeadings}
      />

      <ManageDialog
        title="Useful Information"
        userId={userId}
        open={usefulInfoDialogOpen}
        onOpenChange={setUsefulInfoDialogOpen}
        headings={usefulInfoHeadings}
        onSave={setUsefulInfoHeadings}
      />
    </div>
  );
}
