import { SideNav } from "@/components/side-nav";
import { TopNav } from "@/components/top-nav";
import type React from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <SideNav>
        <main className="flex-1 overflow-auto">
          <TopNav />
          <div className="p-6">{children}</div>
        </main>
      </SideNav>
    </div>
  );
}
