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
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const assignment = await prisma.studentConsultantAssignment.findFirst({
            where: {
                studentId: session.user.id, // 👈 Langsung gunakan User ID dari session
                endDate: null,              // Hanya ambil assignment yang masih aktif
            },
            include: {
                consultant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        consultantProfile: {
                            select: {
                                id: true,
                                specialization: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                startDate: "desc",
            },
        });

        if (!assignment) {
            return { success: false, error: "Belum ada konsultan yang ditugaskan kepada Anda." };
        }

        // Format data output agar siap dipakai oleh UI
        const formattedConsultant = {
            id: assignment.consultant.id,
            name: assignment.consultant.name ?? "Konsultan",
            email: assignment.consultant.email,
            image: assignment.consultant.image,
            specialization: assignment.consultant.consultantProfile?.specialization ?? null,
            profileId: assignment.consultant.consultantProfile?.id ?? null,
        };

        return { success: true, data: formattedConsultant };
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
                scheduledAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
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
        // 1. Ambil session langsung untuk mendapatkan User ID
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const parsed = bookingSchema.parse(data);

        // 2. Parse scheduledAt
        const scheduledAt = new Date(`${parsed.date}T${parsed.startTime}:00`);

        // 3. Cek slot yang bentrok
        const existing = await prisma.booking.findFirst({
            where: {
                consultantId: parsed.consultantId,
                scheduledAt,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });

        if (existing) {
            return {
                success: false,
                error: "Slot ini sudah dipesan. Silakan pilih slot lain.",
            };
        }

        // 4. Hitung durasi menit
        const start = new Date(`${parsed.date}T${parsed.startTime}:00`);
        const end = new Date(`${parsed.date}T${parsed.endTime}:00`);
        const durationMinutes = Math.round(
            (end.getTime() - start.getTime()) / 60000
        );

        if (durationMinutes <= 0) {
            return {
                success: false,
                error: "Waktu selesai harus lebih besar dari waktu mulai.",
            };
        }

        // 5. Simpan booking dengan studentId = User ID (session.user.id)
        await prisma.booking.create({
            data: {
                studentId: session.user.id, // ✅ SEKARANG SUDAH BENAR (Menggunakan User.id)
                consultantId: parsed.consultantId,
                availabilityTemplateId: parsed.availabilityTemplateId,
                availabilityOverrideId: parsed.availabilityOverrideId,
                scheduledAt,
                durationMinutes,
                sessionType: parsed.sessionType,
                status: "PENDING",
                notes: parsed.topic,
            },
        });

        revalidatePath("/student/booking");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error("Error creating booking:", errorMessage);

        return { success: false, error: errorMessage };
    }
}

import { BookingStatus } from "@prisma/client";

export async function updateBookingStatus(id: string, status: BookingStatus) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        await prisma.booking.update({
            where: { id },
            data: { status }
        });
        
        revalidatePath("/consultant/sessions");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function saveSessionNotes(id: string, notes: string, actionItems: any[]) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "CONSULTANT") throw new Error("Unauthorized");

        const booking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) throw new Error("Booking not found");

        await prisma.$transaction([
            prisma.meetingNote.create({
                data: {
                    studentId: booking.studentId,
                    consultantId: booking.consultantId,
                    bookingId: id,
                    title: `Notes for Session ${id}`,
                    content: JSON.stringify({ notes, actionItems }),
                    createdById: session.user.id,
                }
            }),
            prisma.booking.update({
                where: { id },
                data: { status: "COMPLETED" }
            })
        ]);

        revalidatePath(`/consultant/sessions/${id}`);
        revalidatePath("/consultant/sessions");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function addStudentNote(studentId: string, content: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "CONSULTANT") throw new Error("Unauthorized");

        await prisma.meetingNote.create({
            data: {
                studentId,
                consultantId: session.user.id,
                title: "Catatan Konsultan",
                content,
                createdById: session.user.id,
            }
        });

        revalidatePath(`/consultant/students/${studentId}`);
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}