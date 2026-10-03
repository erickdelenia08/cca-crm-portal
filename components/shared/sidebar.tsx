"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  CreditCard,
  CheckSquare,
  BookOpen,
  Bell,
  User,
  Clock,
  CalendarDays,
  FolderOpen
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS_BY_ROLE: Record<string, NavItem[]> = {
  STUDENT: [
    { title: "Dashboard", href: "/student", icon: LayoutDashboard },
    { title: "Bookings", href: "/student/bookings", icon: Calendar },
    { title: "Documents", href: "/student/documents", icon: FileText },
  ],
  CONSULTANT: [
    { title: "Dashboard", href: "/consultant", icon: LayoutDashboard },
    { title: "My Clients", href: "/consultant/clients", icon: Users },
    { title: "Bookings", href: "/consultant/bookings", icon: CalendarDays },
    { title: "Availability", href: "/consultant/availability", icon: Clock },
    { title: "Schedule", href: "/consultant/schedule", icon: Calendar },
    { title: "Sessions", href: "/consultant/sessions", icon: CheckSquare },
    { title: "Documents", href: "/consultant/documents", icon: FolderOpen },
    { title: "Attendance", href: "/consultant/attendance", icon: User },
  ],
  DOCUMENT_PROCESSOR: [
    { title: "Dashboard", href: "/processor", icon: LayoutDashboard },
    { title: "Verify Docs", href: "/processor/documents", icon: FileText },
  ],
  MANAGEMENT: [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Payroll", href: "/admin/payroll", icon: CreditCard },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ],
  TEACHER: [
    { title: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { title: "My Classes", href: "/teacher/classes", icon: BookOpen },
    { title: "Schedule", href: "/teacher/schedule", icon: Calendar },
    { title: "Notifications", href: "/teacher/notifications", icon: Bell },
    { title: "Profile", href: "/teacher/profile", icon: User },
  ],
};

interface SidebarProps {
  role?: string;
}
export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = role ? NAV_ITEMS_BY_ROLE[role] ?? [] : [];
  return (
    <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-white border-r border-[#e2e8f0] font-sans selection:bg-[#3b82f6] selection:text-white shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex h-20 shrink-0 items-center px-8 border-b border-[#f1f5f9]">
        <span className="font-bold text-2xl text-[#0f172a] tracking-tight">
          CCA<span className="text-[#3b82f6]">.</span>
        </span>
      </div>
      <div className="px-8 py-6">
        <span className="text-[11px] font-bold tracking-wider text-[#94a3b8] uppercase mb-4 block">
          {role ? role.replace("_", " ") : "MENU"}
        </span>
        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-[#f1f5f9] text-[#0f172a] shadow-sm"
                    : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center transition-colors",
                  isActive ? "text-[#3b82f6]" : "text-[#64748b] group-hover:text-[#3b82f6]"
                )}>
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </div>
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Footer Profile or Settings Area could go here */}
      <div className="mt-auto p-8 border-t border-[#f1f5f9]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
             <User className="w-5 h-5 text-[#64748b]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f172a]">{role?.replace("_", " ") || "User"}</p>
            <p className="text-[11px] text-[#64748b] font-medium">Logged in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

