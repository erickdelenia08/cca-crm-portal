import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SessionsClient, SessionItem } from "./sessions-client";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "CONSULTANT") {
        redirect("/login");
    }

    const bookings = await prisma.booking.findMany({
        where: {
            consultantId: session.user.id,
        },
        include: {
            student: true,
        },
        orderBy: {
            scheduledAt: "asc",
        },
    });

    const initialSessions: SessionItem[] = bookings.map((b) => {
        const dateObj = new Date(b.scheduledAt);
        const endDateObj = new Date(dateObj.getTime() + b.durationMinutes * 60000);
        
        return {
            id: b.id,
            studentName: b.student.name || "Student",
            studentEmail: b.student.email || "",
            program: b.sessionType === "CONSULTATION" ? "Konsultasi" : "Lainnya",
            topic: "Konsultasi Umum",
            date: dateObj.toISOString().split("T")[0],
            startTime: dateObj.toTimeString().substring(0, 5),
            endTime: endDateObj.toTimeString().substring(0, 5),
            status: b.status as any,
            meetingUrl: b.meetingUrl,
            notes: b.notes,
        };
    });

    return <SessionsClient initialSessions={initialSessions} />;
}