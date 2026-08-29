"use client";

import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-container bg-surface-bright/95 backdrop-blur supports-[backdrop-filter]:bg-surface-bright/60">
      <div className="flex h-16 items-center px-6 gap-4 justify-between w-full">
        <div className="flex items-center gap-4 lg:hidden">
          {/* Mobile menu trigger could go here */}
          <span className="font-bold text-lg text-primary tracking-tight">CRM</span>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-on-surface">{user?.name || "User"}</span>
            <span className="text-xs text-on-surface-variant capitalize">{user?.role?.toLowerCase().replace("_", " ")}</span>
          </div>
          
          <button 
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
            title="Profile"
          >
            <UserIcon className="h-4 w-4 text-on-surface-variant" />
          </button>
          
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex h-9 w-9 items-center justify-center rounded-full text-error hover:bg-error-container transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
