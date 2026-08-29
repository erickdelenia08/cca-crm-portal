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
  CheckSquare
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
    { title: "Schedule", href: "/consultant/schedule", icon: Calendar },
    { title: "Sessions", href: "/consultant/sessions", icon: CheckSquare },
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
};

interface SidebarProps {
  role?: string;
}
export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = role ? NAV_ITEMS_BY_ROLE[role] ?? [] : [];
  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 bg-surface-bright border-r border-surface-container">
      <div className="flex h-16 shrink-0 items-center px-6">
        <span className="font-bold text-xl text-primary tracking-tight">Student CRM</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
