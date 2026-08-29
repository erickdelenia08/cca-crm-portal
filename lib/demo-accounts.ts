import { Role } from "@/prisma/generated/enums";
import { UserCheck, Shield, FileCheck, GraduationCap } from "lucide-react";
export const DEMO_ACCOUNTS = [
    {
        role: Role.STUDENT,
        label: "Student",
        email: "student@demo.com",
        password: "password123",
        icon: GraduationCap,
        color: "hover:bg-blue-50 hover:border-blue-300 text-blue-700",
    },
    {
        role: Role.CONSULTANT,
        label: "Consultant",
        email: "consultant@demo.com",
        password: "password123",
        icon: UserCheck,
        color: "hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700",
    },
    {
        role: Role.DOCUMENT_PROCESSOR,
        label: "Processor",
        email: "processor@demo.com",
        password: "password123",
        icon: FileCheck,
        color: "hover:bg-amber-50 hover:border-amber-300 text-amber-700",
    },
    {
        role: Role.ADMIN_MANAGEMENT,
        label: "Admin",
        email: "admin@demo.com",
        password: "password123",
        icon: Shield,
        color: "hover:bg-purple-50 hover:border-purple-300 text-purple-700",
    },
];