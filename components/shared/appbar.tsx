"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, User, HelpCircle, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface AppBarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
}

// Mapping path URL ke Judul Halaman
const PAGE_TITLES: Record<string, string> = {
    "/student": "Dashboard",
    "/student/schedule": "Book a Session",
    "/student/bookings": "My Bookings",
    "/student/history": "Session History",
    "/student/documents": "Documents",
    "/consultant": "Dashboard",
    "/consultant/schedule": "Schedule",
    "/consultant/sessions": "Sessions",
    "/processor": "Dashboard",
    "/processor/documents": "Verify Documents",
    "/admin": "Dashboard",
    "/admin/users": "User Management",
    "/admin/payroll": "Payroll",
    "/admin/settings": "Settings",
    "/profile": "My Profile",
    "/support": "Help & Support",
};

export function AppBar({ user }: AppBarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Ambil judul halaman saat ini (fallback ke format rapi jika tidak ada di mapping)
    const pageTitle =
        PAGE_TITLES[pathname] ||
        pathname.split("/").pop()?.replace(/-/g, " ") ||
        "Portal";

    const currentUser = session?.user || user;
    const userName = currentUser?.name || "User";
    const userEmail = currentUser?.email || "";
    const userInitial = userName.charAt(0).toUpperCase();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-surface border-b border-outline-variant px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 w-full">
            {/* Judul Halaman Dinamis (Bukan Nama Aplikasi Lagi) */}
            <div>
                <h1 className="text-base font-semibold text-on-surface capitalize">
                    {pageTitle}
                </h1>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-container-high transition-colors focus:outline-hidden"
                >
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold text-sm shadow-xs">
                        {userInitial}
                    </div>
                    <span className="hidden sm:inline-block text-sm font-medium text-on-surface truncate max-w-[120px]">
                        {userName}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface border border-outline-variant rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-3 border-b border-outline-variant">
                            <p className="text-sm font-semibold text-on-surface truncate">
                                {userName}
                            </p>
                            {userEmail && (
                                <p className="text-xs text-on-surface-variant truncate mt-0.5">
                                    {userEmail}
                                </p>
                            )}
                        </div>

                        <div className="py-1">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                            >
                                <User className="w-4 h-4 text-on-surface-variant" />
                                <span>Profile</span>
                            </Link>
                            <Link
                                href="/support"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                            >
                                <HelpCircle className="w-4 h-4 text-on-surface-variant" />
                                <span>Support</span>
                            </Link>
                        </div>

                        <div className="border-t border-outline-variant pt-1">
                            <button
                                type="button"
                                // onClick={() => signOut({ callbackUrl: "/login" })}
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error-container/30 transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4 text-error" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}