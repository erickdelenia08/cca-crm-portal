"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    User,
    LucideIcon,
    FileText,
    CheckSquare,
    Users,
    CreditCard,
    Settings,
    History,
    CalendarDays,
    CalendarCheck,
    HelpCircle,
    CalendarClock,
    Fingerprint,
    Wallet,
    BarChart3,
    SquareActivity,
    Settings2Icon,
    BookOpen,
    Trophy,
} from "lucide-react";
import { CCALogo } from "./logo";

export interface NavItem {
    title: string;
    shortTitle?: string;
    href: string;
    icon: LucideIcon;
}

const NAV_ITEMS_BY_ROLE: Record<string, NavItem[]> = {
    STUDENT: [
        { title: "Dashboard", shortTitle: "Home", href: "/student", icon: LayoutDashboard },
        { title: "Advisory", shortTitle: "Advisory", href: "/student/advisory", icon: CalendarCheck },
        { title: "Booking", shortTitle: "Booking", href: "/student/booking", icon: CalendarCheck },
        // { title: "History", shortTitle: "History", href: "/student/history", icon: History },
        { title: "Documents", shortTitle: "Docs", href: "/student/documents", icon: FileText },
        { title: "Classes", shortTitle: "Classes", href: "/student/classes", icon: SquareActivity },
    ],
    TEACHER: [
        { title: "Dashboard", shortTitle: "Home", href: "/teacher", icon: LayoutDashboard },
        { title: "Classes", shortTitle: "Classes", href: "/teacher/classes", icon: SquareActivity },
        { title: "My Attendance", shortTitle: "Attendance", href: "/teacher/my-attendance", icon: CheckSquare },
        { title: "Materials", shortTitle: "Materials", href: "/teacher/material", icon: BookOpen },
        { title: "Grades", shortTitle: "Grades", href: "/teacher/grades", icon: Trophy },
    ],
    CONSULTANT: [
        { title: "Dashboard", href: "/consultant", icon: LayoutDashboard },
        { title: "Availability", href: "/consultant/availability", icon: CalendarClock },
        { title: "Sessions", href: "/consultant/sessions", icon: CalendarCheck },
        { title: "My Students", href: "/consultant/students", icon: Users },
        { title: "Attendance", href: "/consultant/attendance", icon: Fingerprint },
        // Profile → app bar
    ],
    PROCESSING_DEPARTMENT: [
        { title: "Dashboard", href: "/processor", icon: LayoutDashboard },
        { title: "Document Queue", href: "/processor/documents", icon: FileText },
    ],
    MANAGEMENT: [
        { title: "Dashboard", href: "/management", icon: LayoutDashboard },
        { title: "Bookings", href: "/management/bookings", icon: CalendarCheck },
        { title: "Users", href: "/management/users", icon: Users },
        { title: "Program Type", href: "/management/program-types", icon: Users },
        { title: "Programs", href: "/management/programs", icon: Users },
        { title: "Courses", href: "/management/courses", icon: Users },
        { title: "Enrollments", href: "/management/enrollments", icon: Users },
        { title: "Attendance", href: "/management/attendance", icon: Fingerprint },
        { title: "Invoices", href: "/management/invoices", icon: CreditCard },
        { title: "Payroll", href: "/management/payroll", icon: Wallet },
        { title: "Documents", href: "/management/documents", icon: FileText },
        { title: "Reports", href: "/management/reports", icon: BarChart3 },
        { title: "Settings", href: "/management/settings", icon: Settings2Icon },
        // Profile → app bar
    ],
};

interface NavigationProps {
    role?: string;
    hasCourse?: boolean;
    hasProgram?: boolean;
}

export function Navigation({ role = "STUDENT", hasCourse = true, hasProgram = true }: NavigationProps) {
    const pathname = usePathname();
    let items = NAV_ITEMS_BY_ROLE[role] ?? [];

    if (role === "STUDENT") {
        items = items.filter(item => {
            if (item.title === "Classes") return hasCourse;
            if (["Advisory", "Booking", "Documents"].includes(item.title)) return hasProgram;
            return true;
        });
    }

    const checkIsActive = (href: string) => {
        const isBaseDashboard =
            href === `/${role.toLowerCase()}` || href === "/management" || href === "/processor";
        if (isBaseDashboard) {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(href + "/");
    };

    const totalMobileItems = items.length + 1;

    return (
        <>
            {/* Desktop Sidebar Navigation */}
            <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-white text-slate-700 flex-col py-6 z-20 border-r border-slate-200/80 shadow-xs">
                {/* Brand Header */}
                <div className="px-6 mb-8 flex items-center cursor-pointer">
                    <CCALogo className="h-9" />
                </div>

                {/* <div className="px-6 mb-8 flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center font-bold text-primary shadow-sm text-sm">
                        A
                    </div>
                    <div>
                        <h2 className="font-bold text-base leading-tight text-on-primary">
                            Academix
                        </h2>
                        <p className="text-xs text-primary-fixed-dim capitalize">{role.toLowerCase()} Portal</p>
                    </div>
                </div> */}

                {/* Navigation Links */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {items.map((item) => {
                        const isActive = checkIsActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-blue-700" : "text-slate-500")} />
                                <span className="truncate">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions (Get Support) */}
                <div className="px-3 mt-auto pt-4 border-t border-slate-100">
                    <Link
                        href="/support"
                        className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-medium py-2.5 px-3.5 rounded-lg text-sm transition-colors"
                    >
                        <HelpCircle className="w-4 h-4 shrink-0 text-slate-500" />
                        <span>Get Support</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 text-slate-600 z-30 shadow-lg pb-safe">
                <div
                    className="grid items-center h-16 px-1"
                    style={{
                        gridTemplateColumns: `repeat(${totalMobileItems}, minmax(0, 1fr))`,
                    }}
                >
                    {items.map((item) => {
                        const isActive = checkIsActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "text-blue-700 font-semibold"
                                        : "text-slate-500 hover:text-slate-800"
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200",
                                        isActive ? "bg-blue-50" : "bg-transparent"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 shrink-0" />
                                </div>
                                <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full px-0.5">
                                    {item.shortTitle || item.title}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Profile Link Mobile */}
                    <Link
                        href="/profile"
                        className={cn(
                            "flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all duration-200",
                            pathname === "/profile"
                                ? "text-blue-700 font-semibold"
                                : "text-slate-500 hover:text-slate-800"
                        )}
                    >
                        <div
                            className={cn(
                                "flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200",
                                pathname === "/profile" ? "bg-blue-50" : "bg-transparent"
                            )}
                        >
                            <User className="w-5 h-5 shrink-0" />
                        </div>
                        <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full px-0.5">
                            Profile
                        </span>
                    </Link>
                </div>
            </nav>
        </>
    );
}