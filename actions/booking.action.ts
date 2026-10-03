"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { bookingSchema, BookingInput } from "@/schemas/booking.schema";

export async function getClientProfile() {
    const session = await auth();
    if (!session || session.user.role !== "CLIENT") {
        throw new Error("UNAUTHORIZED");
    }

    const client = await prisma.clientProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!client) {
        throw new Error("Profil Siswa tidak ditemukan.");
    }

    return client;
}
export async function getAssignedConsultant() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const assignment = await prisma.clientConsultantAssignment.findFirst({
            where: {
                clientId: session.user.id, // 👈 Langsung gunakan User ID dari session
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
        const bookings = await prisma.clientBooking.findMany({
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

import { checkScheduleConflict } from "@/services/schedule.service";

export async function createClientBooking(data: BookingInput) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const parsed = bookingSchema.parse(data);
        const scheduledAt = new Date(`${parsed.date}T${parsed.startTime}:00`);

        const start = scheduledAt;
        const end = new Date(`${parsed.date}T${parsed.endTime}:00`);
        const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

        if (durationMinutes <= 0) {
            return { success: false, error: "Waktu selesai harus lebih besar dari waktu mulai." };
        }

        // Run transaction safely
        const result = await prisma.$transaction(async (tx) => {
            const conflictResult = await checkScheduleConflict(tx, {
                clientId: session.user.id,
                staffId: parsed.consultantId,
                startTime: start,
                endTime: end
            });

            if (conflictResult.hasConflict) {
                // Determine user-friendly error message without leaking personal data
                const firstConflict = conflictResult.conflicts[0];
                let msg = "Terjadi bentrok jadwal.";
                if (firstConflict.type === "CLIENT") {
                    msg = `Anda sudah memiliki jadwal lain pada waktu ini: ${firstConflict.title}.`;
                } else if (firstConflict.type === "STAFF") {
                    msg = "Konsultan/Teacher tidak tersedia pada waktu tersebut.";
                }
                
                throw new Error(msg);
            }

            return await tx.clientBooking.create({
                data: {
                    clientId: session.user.id,
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
        }, {
            isolationLevel: "Serializable" // Enforce atomic checks for double bookings
        });

        revalidatePath("/client/bookings");
        return { success: true, data: result };
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error("Error creating booking:", errorMessage);

        return { success: false, error: errorMessage };
    }
}

import { BookingStatus } from "@prisma/client";

export async function updateClientBookingStatus(id: string, status: BookingStatus) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        await prisma.clientBooking.update({
            where: { id },
            data: { status }
        });
        
        revalidatePath("/consultant/sessions");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function saveSessionNotes(id: string, notes: string, actionItems: { id: string; text: string; done: boolean }[]) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "CONSULTANT") throw new Error("Unauthorized");

        const booking = await prisma.clientBooking.findUnique({
            where: { id },
        });

        if (!booking) throw new Error("ClientBooking not found");

        await prisma.$transaction([
            prisma.meetingNote.create({
                data: {
                    clientId: booking.clientId,
                    consultantId: booking.consultantId,
                    bookingId: id,
                    title: `Notes for Session ${id}`,
                    content: JSON.stringify({ notes, actionItems }),
                    createdById: session.user.id,
                }
            }),
            prisma.clientBooking.update({
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

export async function addClientNote(clientId: string, content: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "CONSULTANT") throw new Error("Unauthorized");

        await prisma.meetingNote.create({
            data: {
                clientId,
                consultantId: session.user.id,
                title: "Catatan Konsultan",
                content,
                createdById: session.user.id,
            }
        });

        revalidatePath(`/consultant/clients/${clientId}`);
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function rescheduleClientBooking(bookingId: string, data: BookingInput) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const booking = await prisma.clientBooking.findUnique({
            where: { id: bookingId }
        });

        if (!booking || booking.clientId !== session.user.id) {
            throw new Error("Booking not found or you do not have permission.");
        }

        // 24-hour limit rule: Reschedule is allowed only when there are at least 24 hours before the session start.
        const now = new Date();
        const timeDiff = booking.scheduledAt.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            throw new Error("Reschedule is only allowed at least 24 hours before the session starts.");
        }

        const parsed = bookingSchema.parse(data);
        const scheduledAt = new Date(`${parsed.date}T${parsed.startTime}:00`);
        const start = scheduledAt;
        const end = new Date(`${parsed.date}T${parsed.endTime}:00`);
        const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

        if (durationMinutes <= 0) {
            throw new Error("Waktu selesai harus lebih besar dari waktu mulai.");
        }

        const result = await prisma.$transaction(async (tx) => {
            const conflictResult = await checkScheduleConflict(tx, {
                clientId: session.user.id,
                staffId: parsed.consultantId,
                startTime: start,
                endTime: end,
                excludeBookingId: booking.id
            });

            if (conflictResult.hasConflict) {
                const firstConflict = conflictResult.conflicts[0];
                let msg = "Terjadi bentrok jadwal.";
                if (firstConflict.type === "CLIENT") {
                    msg = `Anda sudah memiliki jadwal lain pada waktu ini: ${firstConflict.title}.`;
                } else if (firstConflict.type === "STAFF") {
                    msg = "Konsultan/Teacher tidak tersedia pada waktu tersebut.";
                }
                throw new Error(msg);
            }

            return await tx.clientBooking.update({
                where: { id: bookingId },
                data: {
                    scheduledAt,
                    durationMinutes,
                    availabilityTemplateId: parsed.availabilityTemplateId,
                    availabilityOverrideId: parsed.availabilityOverrideId,
                    notes: parsed.topic
                }
            });
        }, {
            isolationLevel: "Serializable"
        });

        revalidatePath("/client/bookings");
        return { success: true, data: result };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function cancelClientBooking(bookingId: string, reason?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const booking = await prisma.clientBooking.findUnique({
            where: { id: bookingId }
        });

        if (!booking || booking.clientId !== session.user.id) {
            throw new Error("Booking not found or you do not have permission.");
        }

        // Cancel allowed only if at least 24 hours before
        const now = new Date();
        const timeDiff = booking.scheduledAt.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            throw new Error("Cancellation is only allowed at least 24 hours before the session starts.");
        }

        await prisma.clientBooking.update({
            where: { id: bookingId },
            data: {
                status: "CANCELLED",
                notes: reason ? `${booking.notes}\n\n[Cancelled: ${reason}]` : booking.notes
            }
        });

        revalidatePath("/client/bookings");
        return { success: true };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}