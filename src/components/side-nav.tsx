import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Clock,
  MessageSquare,
  FileText,
  ClipboardList,
  BarChart,
  Settings,
} from "lucide-react"

export function SideNav() {
  return (
    <nav className="w-64 border-r border-border bg-background p-4 flex flex-col gap-1">
      <div className="mb-6">
        <img src="/placeholder.svg?height=40&width=120" alt="Logo" className="h-10" />
      </div>

      <Link href="/dashboard" className="sidebar-item">
        <LayoutDashboard size={20} />
        Dashboard
      </Link>

      <Link href="/schedule" className="sidebar-item">
        <Calendar size={20} />
        Schedule
      </Link>

      <Link href="/staff" className="sidebar-item active">
        <Users size={20} />
        Staff
      </Link>

      <Link href="/clients" className="sidebar-item">
        <UserCircle size={20} />
        Clients
      </Link>

      <Link href="/timesheet" className="sidebar-item">
        <Clock size={20} />
        Timesheet
      </Link>

      <Link href="/communication" className="sidebar-item">
        <MessageSquare size={20} />
        Communication
      </Link>

      <Link href="/invoice" className="sidebar-item">
        <FileText size={20} />
        Invoice
      </Link>

      <Link href="/forms" className="sidebar-item">
        <ClipboardList size={20} />
        Forms
      </Link>

      <Link href="/reports" className="sidebar-item">
        <BarChart size={20} />
        Reports
      </Link>

      <Link href="/account" className="sidebar-item">
        <Settings size={20} />
        Account
      </Link>
    </nav>
  )
}

