"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffForm } from "./staff-form";
import { StaffProfile } from "./staff-profile";
import { StaffSettings } from "./staff-settings";
import type { StaffData } from "@/types/staff/staff";

export function StaffTabs({ data }: { data: StaffData }) {
  return (
    <div className="flex">
      <div className="flex-1">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="form">Add Staff</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <StaffProfile data={data} />
          </TabsContent>
          <TabsContent value="form">
            <StaffForm />
          </TabsContent>
          <TabsContent value="settings">
            <StaffSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
