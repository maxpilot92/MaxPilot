"use client";
import { Search, Bell, Settings, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu } from "./ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useBusinessStore } from "@/store/useBusinessStore";

export function TopNav() {
  const { signOut } = useClerk();
  const router = useRouter();
  const { setCompanyId } = useBusinessStore();
  const handleSignOut = () => {
    setCompanyId("");
    localStorage.removeItem("business-store");
    signOut();
    router.push("/sign-in");
  };
  return (
    <header className="shadow-md bg-background px-6 py-3 h-[88px]">
      <div className="flex items-center justify-between h-full">
        <div className="relative w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8" />
        </div>
        <div className="flex items-center gap-4">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Settings className="h-5 w-5 text-muted-foreground" />
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <span className="cursor-pointer" onClick={handleSignOut}>
                  Sign-out
                </span>
              </DropdownMenuContent>
            </DropdownMenu>
            <span>Jane</span>
          </div>
        </div>
      </div>
    </header>
  );
}
