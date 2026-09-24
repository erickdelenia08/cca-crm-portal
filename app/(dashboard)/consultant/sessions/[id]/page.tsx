import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SessionDetailClient, SessionDetailData } from "./session-detail-client";

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "CONSULTANT") {
        redirect("/login");
    }

    const booking = await prisma.booking.findUnique({
        where: {
            id: (await params).id,
            consultantId: session.user.id,
        },
        include: {
            student: true,
            meetingNotes: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    });

    if (!booking) {
        return (
            <div className="p-6 text-center text-slate-500 mt-20">
                Sesi tidak ditemukan atau Anda tidak memiliki akses.
            </div>
        );
    }

    const dateObj = new Date(booking.scheduledAt);
    const endDateObj = new Date(dateObj.getTime() + booking.durationMinutes * 60000);

    let existingNotes = "";
    let existingActionItems = [];

    if (booking.meetingNotes.length > 0) {
        try {
            const content = JSON.parse(booking.meetingNotes[0].content);
            existingNotes = content.notes || "";
            existingActionItems = content.actionItems || [];
        } catch (e) {
            existingNotes = booking.meetingNotes[0].content;
        }
    }

    const sessionData: SessionDetailData = {
        id: booking.id,
        studentName: booking.student.name || "Student",
        studentEmail: booking.student.email || "",
        studentId: booking.studentId,
        program: booking.sessionType === "CONSULTATION" ? "Konsultasi" : "Lainnya",
        topic: "Konsultasi Umum",
        date: dateObj.toISOString().split("T")[0],
        startTime: dateObj.toTimeString().substring(0, 5),
        endTime: endDateObj.toTimeString().substring(0, 5),
        status: booking.status,
        meetingUrl: booking.meetingUrl,
        studentNotes: booking.notes,
        existingNotes,
        existingActionItems,
    };

    return <SessionDetailClient sessionData={sessionData} />;
}