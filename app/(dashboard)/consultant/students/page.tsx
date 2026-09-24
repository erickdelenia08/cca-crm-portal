import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentsClient, StudentCardData } from "./students-client";

export const dynamic = "force-dynamic";

export default async function MyStudentsPage() {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "CONSULTANT") {
        redirect("/login");
    }

    const assignments = await prisma.studentConsultantAssignment.findMany({
        where: {
            consultantId: session.user.id,
            endDate: null,
        },
        include: {
            student: {
                include: {
                    studentEnrollments: {
                        where: {
                            status: { in: ["ONBOARDING", "PROCESSING", "ACTIVE"] },
                        },
                        include: {
                            programType: { include: { program: true } },
                            documentRequirements: {
                                include: {
                                    documents: true,
                                }
                            }
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                    studentBookings: {
                        where: {
                            consultantId: session.user.id,
                            status: "COMPLETED",
                        },
                        orderBy: {
                            scheduledAt: "desc",
                        },
                        take: 1,
                    }
                }
            }
        }
    });

    const studentCards: StudentCardData[] = assignments.map((assignment) => {
        const student = assignment.student;
        const activeEnrollment = student.studentEnrollments[0];
        
        let programName = "Belum terdaftar program";
        let status = "Onboarding";
        let docCompleted = 0;
        let docTotal = 0;

        if (activeEnrollment) {
            programName = activeEnrollment.programType?.name || "Program";
            status = activeEnrollment.status === "ACTIVE" ? "Aktif" : (activeEnrollment.status === "PROCESSING" ? "Processing" : "Onboarding");
            
            docTotal = activeEnrollment.documentRequirements.length;
            docCompleted = activeEnrollment.documentRequirements.filter((req: any) => 
                req.documents.some((doc: any) => doc.status === "APPROVED")
            ).length;
        }

        const lastSession = student.studentBookings.length > 0 
            ? new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }).format(new Date(student.studentBookings[0].scheduledAt))
            : "Belum ada sesi";

        return {
            id: student.id,
            name: student.name || "Student",
            program: programName,
            lastSession,
            docStatus: { completed: docCompleted, total: docTotal },
            status,
        };
    });

    return <StudentsClient students={studentCards} />;
}