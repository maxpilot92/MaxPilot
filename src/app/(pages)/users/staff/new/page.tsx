import { SideNav } from "@/components/side-nav";
import { StaffForm } from "@/components/staff-form";
import { TopNav } from "@/components/top-nav";
import React from "react";

export default function page() {
  return (
    <div className="flex h-screen bg-background">
      <SideNav />
      <main className="flex-1 overflow-auto">
        <TopNav />
        <div className="p-6">
          <StaffForm />
        </div>
      </main>
    </div>
  );
}
