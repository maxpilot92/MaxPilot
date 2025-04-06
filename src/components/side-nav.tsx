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
import { BASE_URL } from "@/utils/domain";
import { useUser } from "@clerk/nextjs";

const menuItems = [
  {
    category: "Operation Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: `${BASE_URL}/users/dashboard`,
      },
      {
        title: "Schedule",
        icon: Calendar,
        url: `${BASE_URL}/users/areas`,
      },
      {
        title: "Worklog",
        icon: ClipboardList,
        url: `/timesheet`,
      },
    ],
  },
  {
    category: "Personnel Management",
    items: [
      {
        title: "Staff",
        icon: Users,
        url: `/staff`,
        hasSubmenu: true,
        subMenuItems: [
          {
            title: "List",
            url: `${BASE_URL}/users/staff`,
          },
          {
            title: "Teams",
            url: `${BASE_URL}/users/staff/team`,
          },
          {
            title: "Archived",
            url: `${BASE_URL}/users/staff/archived`,
          },
          {
            title: "Documents",
            url: `${BASE_URL}/users/staff/document`,
          },
        ],
      },
      {
        title: "Clients",
        icon: Users2,
        url: "/clients",
        hasSubmenu: true,
        isActive: true,
        subMenuItems: [
          {
            title: "List",
            url: `${BASE_URL}/users/client`,
          },
          {
            title: "Archived",
            url: `${BASE_URL}/users/client/archived`,
          },
          {
            title: "Documents",
            url: `${BASE_URL}/users/client/document`,
          },
        ],
      },
    ],
  },
  {
    category: "Document Management",
    items: [
      {
        title: "Invoice",
        icon: FileText,
        url: "/invoice",
        hasSubmenu: true,
      },
      {
        title: "Forms",
        icon: FormInput,
        url: `${BASE_URL}/users/forms`,
      },
    ],
  },
  {
    category: "Incident & Reporting",
    items: [
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
    ],
  },
];

export function SideNav({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = React.useState("");
  const { user } = useUser();

  React.useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-white">
        <SidebarHeader className="p-4">
          <Image
            src={Logo || "/placeholder.svg"}
            alt="MaxPilot Logo"
            width={120}
            height={30}
            className="dark:invert"
          />
        </SidebarHeader>
        <SidebarContent className="px-2">
          {menuItems.map((section) => (
            <div key={section.category} className="mb-4">
              <h3 className="px-3 py-2 text-sm font-normal text-muted-foreground">
                {section.category}
              </h3>
              <SidebarMenu>
                {section.items.map((item) => (
                  <MenuItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </div>
          ))}

          <Link
            href="/pricing"
            className="mt-4 mx-2 mb-4 rounded-md bg-green-50 p-3 text-center cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center text-green-500 font-medium mb-1">
                Upgrade Now!{" "}
                <span className="ml-1 inline-block">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </span>
              </div>
              <div className="text-xs text-green-600">
                Your trial expires in{" "}
                <span className="font-medium">5-days</span>
              </div>
            </div>
          </Link>

          <SidebarMenu className="mt-4">
            <SidebarMenuItem className="text-[#726C6C]">
              <SidebarMenuButton asChild className="gap-2">
                <Link href={`${BASE_URL}/users/account/${userId}`}>
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="text-[#726C6C]">
              <SidebarMenuButton asChild className="gap-2">
                <Link href="/help">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>Help</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
}

interface MenuItemProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  hasSubmenu?: boolean;
  isActive?: boolean;
  subMenuItems?: { title: string; url: string }[];
}

function MenuItem({ item }: { item: MenuItemProps }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const Icon = item.icon;

  const activeStyles = item.isActive
    ? "bg-emerdald-500 text-swhite"
    : "text-[#726Cc6C] hover:sbg-gray-100";

  if (!item.hasSubmenu) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild className={`gap-2 ${activeStyles}`}>
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
      className={activeStyles}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={`gap-2 w-full justify-between ${activeStyles}`}
          >
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
            {item.subMenuItems?.map((subItem) => (
              <SidebarMenuItem key={subItem.title}>
                <SidebarMenuButton asChild>
                  <Link href={subItem.url}>{subItem.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
