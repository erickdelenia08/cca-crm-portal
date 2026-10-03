"use client";

import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  FileCheck,
  LogIn,
  ArrowRight,
  Sparkles,
  GraduationCap
} from "lucide-react";

export default function RootLandingPage() {
  const dashboards = [
    {
      title: "Student Portal",
      path: "/student",
      role: "Academic progress & documents",
      icon: GraduationCap,
      lightAccent: "bg-[#e0f2fe] text-[#0284c7]", // info container
      borderAccent: "group-hover:border-[#0284c7]",
    },
    {
      title: "Consultant Workspace",
      path: "/consultant",
      role: "Manage sessions & clients",
      icon: UserCheck,
      lightAccent: "bg-[#e0e7ff] text-[#3730a3]", // secondary container
      borderAccent: "group-hover:border-[#4f46e5]",
    },
    {
      title: "Document Processing",
      path: "/processor",
      role: "Verification & compliance",
      icon: FileCheck,
      lightAccent: "bg-[#d1fae5] text-[#065f46]", // success container
      borderAccent: "group-hover:border-[#10b981]",
    },
    {
      title: "Management Oversight",
      path: "/admin",
      role: "System control & analytics",
      icon: ShieldCheck,
      lightAccent: "bg-[#e2e8f0] text-[#0f172a]", // primary fixed
      borderAccent: "group-hover:border-[#1e293b]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Navbar */}
      <header className="px-6 py-6 md:px-12 flex justify-between items-center w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center shadow-sm">
             <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-[#0f172a] tracking-tight">
            CCA<span className="text-[#3b82f6]">.</span>
          </span>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#f1f5f9] text-[#0f172a] border border-[#cbd5e1] text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow"
        >
          Sign In <LogIn className="w-4 h-4 text-[#475569]" />
        </Link>
      </header>

      {/* Hero Content */}
      <main className="flex-1 w-full px-6 md:px-12 py-12 md:py-20 grid lg:grid-cols-12 gap-16 lg:gap-12 items-center max-w-[1440px] mx-auto">
        {/* Left Typography Column */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#0f172a] tracking-tight leading-[1.05]">
              Educational<br />
              Management<br />
              <span className="text-[#3b82f6]">Platform</span>
            </h1>
            <p className="text-lg md:text-xl text-[#475569] leading-relaxed max-w-lg font-normal">
              A unified system for students, consultants, and management to streamline academic operations, scheduling, and document workflows.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1e293b] hover:bg-[#0f172a] text-white text-base font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Access Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Dashboard Grid */}
        <div className="lg:col-span-7 relative">
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {dashboards.map((dash) => {
              const Icon = dash.icon;
              return (
                <Link
                  key={dash.path}
                  href={dash.path}
                  className={`group relative bg-white border border-[#e2e8f0] p-8 rounded-2xl transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 ${dash.borderAccent}`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${dash.lightAccent}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[#f1f5f9] flex items-center justify-center bg-[#f8fafc] group-hover:bg-[#1e293b] group-hover:border-[#1e293b] transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-xl mb-2 tracking-tight group-hover:text-[#3b82f6] transition-colors">
                      {dash.title}
                    </h3>
                    <p className="text-[15px] text-[#64748b] leading-relaxed">
                      {dash.role}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#e2e8f0] w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <p className="text-sm text-[#64748b]">
          &copy; {new Date().getFullYear()} Consultan Central Asia. All rights reserved.
        </p>
        <div className="flex gap-8 text-sm font-medium text-[#64748b]">
          <Link href="/privacy" className="hover:text-[#0f172a] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#0f172a] transition-colors">Terms of Service</Link>
          <Link href="/support" className="hover:text-[#0f172a] transition-colors">System Status</Link>
        </div>
      </footer>
    </div>
  );
}