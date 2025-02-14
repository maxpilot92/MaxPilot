"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffForm } from "./staff-form";
import { StaffProfile } from "./staff-profile";
import { StaffSettings } from "./staff-settings";

export function StaffTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full max-w-[1200px] mx-auto">
      <TabsList className="mb-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="form">Add Staff</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <StaffProfile />
      </TabsContent>
      <TabsContent value="form">
        <StaffForm />
      </TabsContent>
      <TabsContent value="settings">
        <StaffSettings />
      </TabsContent>
    </Tabs>
  );
}
