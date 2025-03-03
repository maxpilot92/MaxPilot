"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInformation from "@/components/client/client-information";
import DocumentCategories from "@/components/client/document-categories";
import { useParams } from "next/navigation";

export default function AccountSettings() {
  const params = useParams();
  const id = params.id;
  const [activeTab, setActiveTab] = useState("client-information");
  if (!id) {
    throw new Error("Missing user id");
  }
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
        <p className="text-sm text-teal-600">Settings</p>
      </div>

      <Tabs
        defaultValue="client-information"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="client-information">
            Client Information
          </TabsTrigger>
          <TabsTrigger value="staff-information">Staff Information</TabsTrigger>
          <TabsTrigger value="time-schedule">Time and Schedule</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Account Details</h2>
            <p className="text-gray-500">
              Configure your account details here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="client-information">
          <ClientInformation userId={id as string} />
          <div className="mt-8">
            <DocumentCategories />
          </div>
        </TabsContent>

        <TabsContent value="staff-information">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Staff Information</h2>
            <p className="text-gray-500">
              Configure staff information settings here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="time-schedule">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Time and Schedule</h2>
            <p className="text-gray-500">
              Configure time and schedule settings here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="integration">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Integration</h2>
            <p className="text-gray-500">
              Configure integration settings here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
