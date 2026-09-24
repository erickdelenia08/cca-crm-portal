import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentDetailClient } from "./student-detail-client";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "CONSULTANT") {
        redirect("/login");
    }

    const assignment = await prisma.studentConsultantAssignment.findFirst({
        where: {
            studentId: (await params).id,
            consultantId: session.user.id,
            endDate: null,
        },
    });

    if (!assignment) {
        return (
            <div className="p-6 text-center text-slate-500 mt-20">
                Siswa tidak ditemukan atau bukan binaan Anda.
            </div>
        );
    }

    const student = await prisma.user.findUnique({
        where: { id: (await params).id },
        include: {
            studentProfile: true,
            studentEnrollments: {
                where: { status: { in: ["ONBOARDING", "PROCESSING", "ACTIVE"] } },
                include: {
                    documentRequirements: {
                        include: { documents: { orderBy: { createdAt: "desc" }, take: 1 } }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: 1
            },
            studentMeetingNotes: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!student) redirect("/consultant/students");

    const profileData = {
        id: student.id,
        name: student.name || "Siswa",
        email: student.email || "-",
        phone: student.studentProfile?.phone || "-",
        location: student.studentProfile?.address || "-",
        academic: student.studentProfile?.educationLevel || "-",
        // preferences: student.studentProfile?.preferences || "-",
    };

    const documentsData = [];
    if (student.studentEnrollments[0]) {
        for (const req of student.studentEnrollments[0].documentRequirements) {
            const doc = req.documents[0];
            documentsData.push({
                id: req.id,
                name: req.name,
                status: doc?.status || "NOT_UPLOADED",
                date: doc?.createdAt ? new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                }).format(doc.createdAt) : "-",
            });
        }
    }

    const notesData = student.studentMeetingNotes.map(note => {
        let content = note.content;
        try {
            const parsed = JSON.parse(note.content);
            content = parsed.notes || note.content;
        } catch (e) { }

        return {
            id: note.id,
            date: new Intl.DateTimeFormat("id-ID", {
                day: "numeric", month: "short", year: "numeric"
            }).format(note.createdAt),
            author: note.consultantId === session.user.id ? "Anda" : "Konsultan Lain",
            content,
        };
    });

    return (
        <StudentDetailClient
            profile={profileData}
            documents={documentsData}
            initialNotes={notesData}
        />
    );
}