import { getProcessorEnrollment } from "@/actions/processor-portal.action";
import { Briefcase, FileText, History, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ProcessorEnrollmentLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ enrollmentId: string }>;
}) {
    const resolvedParams = await params;
    const { success, data: enrollment, error } = await getProcessorEnrollment(resolvedParams.enrollmentId);

    if (!success || !enrollment) {
        notFound();
    }

    const tabs = [
        {
            name: "Overview",
            href: `/processor/enrollments/${resolvedParams.enrollmentId}`,
            icon: Briefcase
        },
        {
            name: "Documents",
            href: `/processor/enrollments/${resolvedParams.enrollmentId}/documents`,
            icon: FileText
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        {enrollment.client.clientProfile?.fullName || enrollment.client.name || 'Unknown'}
                    </h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{enrollment.programType.name}</span>
                        <span className="text-slate-300">•</span>
                        <span>{enrollment.programType.program.name}</span>
                    </p>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-2 -mb-2 gap-2 border-b">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "text-slate-600 hover:text-slate-900"
                        )}
                    >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.name}
                    </Link>
                ))}
            </div>

            <div className="pt-2">
                {children}
            </div>
        </div>
    );
}
