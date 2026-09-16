"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { bookingSchema, BookingInput } from "@/schemas/booking.schema";

export async function getStudentProfile() {
    const session = await auth();
    if (!session || session.user.role !== "STUDENT") {
        throw new Error("UNAUTHORIZED");
    }

    const student = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!student) {
        throw new Error("Profil Siswa tidak ditemukan.");
    }

    return student;
}

export async function getAssignedConsultant() {
    try {
        const student = await getStudentProfile();
        
        const assignment = await prisma.studentConsultantAssignment.findFirst({
            where: {
                studentId: student.id,
                endDate: null // Only get active assignment
            },
            include: {
                consultant: {
                    select: {
                        id: true,
                        fullName: true,
                        specialization: true
                    }
                }
            }
        });

        if (!assignment) {
            return { success: false, error: "Belum ada konsultan yang ditugaskan kepada Anda." };
        }

        return { success: true, data: assignment.consultant };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function getConsultantAvailability(consultantId: string) {
    try {
        // Fetch templates
        const templates = await prisma.availabilityTemplate.findMany({
            where: { consultantId }
        });

        // Fetch overrides (from today onwards)
        const overrides = await prisma.availabilityOverride.findMany({
            where: {
                consultantId,
                date: { gte: new Date().toISOString().split("T")[0] }
            }
        });

        // Fetch bookings (from today onwards) to mark slots as booked
        const bookings = await prisma.booking.findMany({
            where: {
                consultantId,
                status: { in: ["PENDING", "CONFIRMED"] },
                scheduledAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
            },
            select: {
                id: true,
                scheduledAt: true,
                availabilityTemplateId: true,
                availabilityOverrideId: true
            }
        });

        return { success: true, data: { templates, overrides, bookings } };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function createStudentBooking(data: BookingInput) {
    try {
        const student = await getStudentProfile();
        const parsed = bookingSchema.parse(data);

        // Parse scheduledAt
        const scheduledAt = new Date(`${parsed.date}T${parsed.startTime}:00`);

        // Check for existing booking on exactly the same slot for this consultant
        const existing = await prisma.booking.findFirst({
            where: {
                consultantId: parsed.consultantId,
                scheduledAt,
                status: { in: ["PENDING", "CONFIRMED"] }
            }
        });

        if (existing) {
            throw new Error("Slot ini sudah dipesan. Silakan pilih slot lain.");
        }

        const durationMinutes = (new Date(`1970-01-01T${parsed.endTime}:00`).getTime() - new Date(`1970-01-01T${parsed.startTime}:00`).getTime()) / 60000;

        await prisma.booking.create({
            data: {
                studentId: student.id,
                consultantId: parsed.consultantId,
                availabilityTemplateId: parsed.availabilityTemplateId,
                availabilityOverrideId: parsed.availabilityOverrideId,
                scheduledAt,
                durationMinutes,
                sessionType: parsed.sessionType,
                status: "PENDING",
                notes: parsed.topic
            }
        });

        revalidatePath("/student/booking");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
