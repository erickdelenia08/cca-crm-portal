"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { availabilitySchema, AvailabilityInput } from "@/schemas/availability.schema";

// Helper internal untuk validasi otorisasi & ambil User ID langsung dari Session
async function getAuthenticatedConsultantId(): Promise<string> {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "CONSULTANT" && session.user.role !== "MANAGEMENT")) {
        throw new Error("UNAUTHORIZED");
    }
    return session.user.id;
}

export async function getAvailabilityTemplates() {
    try {
        const consultantId = await getAuthenticatedConsultantId();

        const templates = await prisma.availabilityTemplate.findMany({
            where: { consultantId },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" }
            ]
        });

        return { success: true, data: templates };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function getAvailabilityOverrides() {
    try {
        const consultantId = await getAuthenticatedConsultantId();

        const overrides = await prisma.availabilityOverride.findMany({
            where: { consultantId },
            orderBy: [
                { date: "asc" },
                { startTime: "asc" }
            ]
        });

        return { success: true, data: overrides };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function createAvailabilitySlots(data: AvailabilityInput) {
    try {
        const consultantId = await getAuthenticatedConsultantId();
        const parsed = availabilitySchema.parse(data);

        const timeToMinutes = (timeStr: string) => {
            const [h, m] = timeStr.split(":").map(Number);
            return h * 60 + m;
        };

        const minutesToTime = (mins: number) => {
            const h = Math.floor(mins / 60).toString().padStart(2, "0");
            const m = (mins % 60).toString().padStart(2, "0");
            return `${h}:${m}`;
        };

        const startMin = timeToMinutes(parsed.startTime);
        const endMin = timeToMinutes(parsed.endTime);
        const slotDuration = parsed.duration;

        if (endMin <= startMin) {
            throw new Error("Jam selesai harus lebih besar dari jam mulai.");
        }

        let current = startMin;

        if (parsed.type === "RECURRING") {
            const newSlots = [];
            while (current + slotDuration <= endMin) {
                newSlots.push({
                    consultantId, // 👈 Langsung gunakan User ID
                    dayOfWeek: parsed.dayOfWeek!,
                    startTime: minutesToTime(current),
                    endTime: minutesToTime(current + slotDuration),
                    isActive: true
                });
                current += slotDuration;
            }

            if (newSlots.length === 0) {
                throw new Error("Durasi terlalu panjang untuk rentang waktu yang dipilih.");
            }

            await prisma.availabilityTemplate.createMany({
                data: newSlots
            });
        } else {
            const newOverrides = [];
            while (current + slotDuration <= endMin) {
                newOverrides.push({
                    consultantId, // 👈 Langsung gunakan User ID
                    date: parsed.date!,
                    startTime: minutesToTime(current),
                    endTime: minutesToTime(current + slotDuration),
                    isAvailable: true
                });
                current += slotDuration;
            }

            if (newOverrides.length === 0) {
                throw new Error("Durasi terlalu panjang untuk rentang waktu yang dipilih.");
            }

            await prisma.availabilityOverride.createMany({
                data: newOverrides
            });
        }

        revalidatePath("/consultant/availability");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function deleteAvailabilitySlot(id: string, type: "RECURRING" | "DATE") {
    try {
        const consultantId = await getAuthenticatedConsultantId();

        if (type === "RECURRING") {
            const template = await prisma.availabilityTemplate.findUnique({
                where: { id }
            });

            if (!template || template.consultantId !== consultantId) {
                throw new Error("Template tidak ditemukan atau bukan milik Anda.");
            }

            const activeBookings = await prisma.clientBooking.count({
                where: {
                    availabilityTemplateId: id,
                    status: { in: ["PENDING", "CONFIRMED"] },
                    scheduledAt: { gte: new Date() }
                }
            });

            if (activeBookings > 0) {
                throw new Error("Tidak dapat menghapus slot karena masih ada booking aktif.");
            }

            await prisma.availabilityTemplate.delete({
                where: { id }
            });
        } else {
            const override = await prisma.availabilityOverride.findUnique({
                where: { id }
            });

            if (!override || override.consultantId !== consultantId) {
                throw new Error("Slot tidak ditemukan atau bukan milik Anda.");
            }

            const activeBookings = await prisma.clientBooking.count({
                where: {
                    availabilityOverrideId: id,
                    status: { in: ["PENDING", "CONFIRMED"] },
                    scheduledAt: { gte: new Date() }
                }
            });

            if (activeBookings > 0) {
                throw new Error("Tidak dapat menghapus slot karena masih ada booking aktif.");
            }

            await prisma.availabilityOverride.delete({
                where: { id }
            });
        }

        revalidatePath("/consultant/availability");
        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function getBookingsForCalendar() {
    try {
        const consultantId = await getAuthenticatedConsultantId();

        const bookings = await prisma.clientBooking.findMany({
            where: {
                consultantId, // 👈 Gunakan User ID
                status: {
                    in: ["PENDING", "CONFIRMED"]
                },
                scheduledAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            },
            include: {
                client: { // 👈 Select name langsung dari User model
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        return { success: true, data: bookings };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}