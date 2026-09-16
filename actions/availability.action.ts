"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { availabilitySchema, AvailabilityInput } from "@/schemas/availability.schema";

async function getConsultantProfile() {
    const session = await auth();
    if (!session || (session.user.role !== "CONSULTANT" && session.user.role !== "MANAGEMENT")) {
        throw new Error("UNAUTHORIZED");
    }

    const consultant = await prisma.consultantProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!consultant) {
        throw new Error("Profil Konsultan tidak ditemukan.");
    }

    return consultant;
}

export async function getAvailabilityTemplates() {
    try {
        const consultant = await getConsultantProfile();
        
        const templates = await prisma.availabilityTemplate.findMany({
            where: { consultantId: consultant.id },
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
        const consultant = await getConsultantProfile();
        
        const overrides = await prisma.availabilityOverride.findMany({
            where: { consultantId: consultant.id },
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
        const consultant = await getConsultantProfile();
        const parsed = availabilitySchema.parse(data);

        // Convert string times to minutes for calculation
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
                    consultantId: consultant.id,
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
                    consultantId: consultant.id,
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
        const consultant = await getConsultantProfile();
        
        if (type === "RECURRING") {
            const template = await prisma.availabilityTemplate.findUnique({
                where: { id }
            });

            if (!template || template.consultantId !== consultant.id) {
                throw new Error("Template tidak ditemukan atau bukan milik Anda.");
            }

            const activeBookings = await prisma.booking.count({
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

            if (!override || override.consultantId !== consultant.id) {
                throw new Error("Slot tidak ditemukan atau bukan milik Anda.");
            }

            const activeBookings = await prisma.booking.count({
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

// Function to fetch booked slots to display on the calendar
export async function getBookingsForCalendar() {
    try {
        const consultant = await getConsultantProfile();

        const bookings = await prisma.booking.findMany({
            where: {
                consultantId: consultant.id,
                status: {
                    in: ["PENDING", "CONFIRMED"]
                },
                scheduledAt: {
                    gte: new Date(new Date().setHours(0,0,0,0))
                }
            },
            include: {
                student: {
                    select: {
                        fullName: true
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
