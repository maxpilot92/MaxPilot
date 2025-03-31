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
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { getStripe } from "@/lib/stripe/client";

const menuItems = [
  {
    category: "Operation Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
      },
      {
        title: "Schedule",
        icon: Calendar,
        url: "http://localhost:3000/users/areas",
      },
      {
        title: "Worklog",
        icon: ClipboardList,
        url: "/timesheet",
      },
    ],
  },
  {
    category: "Personnel Management",
    items: [
      {
        title: "Staff",
        icon: Users,
        url: "/staff",
        hasSubmenu: true,
        subMenuItems: [
          {
            title: "List",
            url: "http://localhost:3000/users/staff",
          },
          {
            title: "Teams",
            url: "http://localhost:3000/users/staff/team",
          },
          {
            title: "Archived",
            url: "http://localhost:3000/users/staff/archived",
          },
          {
            title: "Documents",
            url: "http://localhost:3000/users/staff/document",
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
            url: "http://localhost:3000/users/client",
          },
          {
            title: "Archived",
            url: "http://localhost:3000/users/client/archived",
          },
          {
            title: "Documents",
            url: "http://localhost:3000/users/client/document",
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
        url: "/users/forms",
        hasSubmenu: true,
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
  const { user } = useUser();
  const handleSubscription = async () => {
    try {
      // 1. Call your API to create the checkout session
      const response = await axios.post("/api/subscriptions/create", {
        price: "price_1R8bng09Pi8IX7t9oMrZxw9h", // Use priceId instead of price
        customerEmail: user?.emailAddresses[0].emailAddress,
      });

      // 2. Get the session ID from response
      const { sessionId } = response.data;

      // 3. Redirect to Stripe Checkout
      const stripe = await getStripe(); // Import getStripe from '@/lib/stripe/client'
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert("Failed to redirect to payment page");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start subscription process");
    }
  };
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

          <div
            className="mt-4 mx-2 mb-4 rounded-md bg-green-50 p-3 text-center cursor-pointer"
            onClick={handleSubscription}
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
          </div>

          <SidebarMenu className="mt-4">
            <SidebarMenuItem className="text-[#726C6C]">
              <SidebarMenuButton asChild className="gap-2">
                <Link href="/settings">
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
    ? "bg-emerald-500 text-white hover:bg-emerald-600"
    : "text-[#726C6C] hover:bg-gray-100";

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
