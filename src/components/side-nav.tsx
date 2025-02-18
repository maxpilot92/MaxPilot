"use client";

import * as React from "react";
import {
  BarChart2,
  Calendar,
  ChevronDown,
  ClipboardList,
  FileText,
  FormInput,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldAlert,
  Users,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Logo from "@/../public/logo.svg";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Schedule",
    icon: Calendar,
    url: "/schedule",
  },
  {
    title: "Staff",
    icon: Users,
    url: "/staff",
    hasSubmenu: true,
  },
  {
    title: "Clients",
    icon: Users2,
    url: "/clients",
    hasSubmenu: true,
  },
  {
    title: "Timesheet",
    icon: ClipboardList,
    url: "/timesheet",
  },
  {
    title: "Communication",
    icon: MessageSquare,
    url: "/communication",
    hasSubmenu: true,
  },
  {
    title: "Invoice",
    icon: FileText,
    url: "/invoice",
    hasSubmenu: true,
  },
  {
    title: "Forms",
    icon: FormInput,
    url: "/forms",
    hasSubmenu: true,
  },
  {
    title: "Incidents",
    icon: ShieldAlert,
    url: "/incidents",
    hasSubmenu: true,
  },
  {
    title: "Reports",
    icon: BarChart2,
    url: "/reports",
    hasSubmenu: true,
  },
  {
    title: "Account",
    icon: Settings,
    url: "/account",
    hasSubmenu: true,
  },
];

export function SideNav({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Image
            src={Logo || "/placeholder.svg"}
            alt="MaxPilot Logo"
            width={120}
            height={30}
            className="dark:invert"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="mt-5">
            {menuItems.map((item) => (
              <MenuItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
}

function MenuItem({ item }: { item: (typeof menuItems)[number] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const Icon = item.icon;

  if (!item.hasSubmenu) {
    return (
      <SidebarMenuItem className="text-[#726C6C]">
        <SidebarMenuButton asChild className="gap-2">
          <Link href={item.url}>
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="text-[#726C6C]"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform duration-200"
              style={{
                transform: isOpen ? "rotate(-180deg)" : undefined,
              }}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-10 py-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${item.url}/overview`}>List</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`/users/staff/team`}>Teams</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${item.url}/settings`}>Archived</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${item.url}/settings`}>Documents</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
