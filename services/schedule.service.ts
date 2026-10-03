import { prisma } from "@/lib/prisma";

export type ConflictResult = {
    hasConflict: boolean;
    conflicts: Array<{
        type: "CLIENT" | "STAFF";
        source: "BOOKING" | "COURSE_SESSION" | "UNAVAILABLE_PERIOD";
        title: string;
        startTime: Date;
        endTime: Date;
    }>;
};

import { PrismaClient, Prisma } from "@prisma/client";

export async function checkScheduleConflict(
    tx: Prisma.TransactionClient | PrismaClient,
    {
        clientId,
        staffId,
        startTime,
        endTime,
        excludeBookingId
    }: {
        clientId: string;
        staffId: string;
        startTime: Date;
        endTime: Date;
        excludeBookingId?: string;
    }
): Promise<ConflictResult> {
    const conflicts: ConflictResult["conflicts"] = [];

    // Base overlap condition
    const overlapCondition = {
        AND: [
            { startTime: { lt: endTime } },
            { endTime: { gt: startTime } }
        ]
    };

    // 1. Check Client Bookings
    const clientBookings = await tx.clientBooking.findMany({
        where: {
            clientId,
            status: { in: ["PENDING", "CONFIRMED"] },
            id: excludeBookingId ? { not: excludeBookingId } : undefined,
            // ClientBooking uses scheduledAt and durationMinutes
        },
    });

    for (const b of clientBookings) {
        const bStart = b.scheduledAt;
        const bEnd = new Date(bStart.getTime() + b.durationMinutes * 60000);
        if (bStart < endTime && bEnd > startTime) {
            conflicts.push({
                type: "CLIENT",
                source: "BOOKING",
                title: `Booking (${b.sessionType})`,
                startTime: bStart,
                endTime: bEnd
            });
        }
    }

    // 2. Check Client Course Sessions
    const clientCourseSessions = await tx.courseSession.findMany({
        where: {
            courseClass: {
                enrollments: {
                    some: {
                        clientId,
                        status: "ACTIVE"
                    }
                }
            },
            ...overlapCondition
        },
        include: { courseClass: true }
    });

    for (const session of clientCourseSessions) {
        conflicts.push({
            type: "CLIENT",
            source: "COURSE_SESSION",
            title: `Class: ${session.courseClass.name || session.title}`,
            startTime: session.startTime,
            endTime: session.endTime
        });
    }

    // 3. Check Staff Bookings
    const staffBookings = await tx.clientBooking.findMany({
        where: {
            consultantId: staffId,
            status: { in: ["PENDING", "CONFIRMED"] },
            id: excludeBookingId ? { not: excludeBookingId } : undefined,
        },
    });

    for (const b of staffBookings) {
        const bStart = b.scheduledAt;
        const bEnd = new Date(bStart.getTime() + b.durationMinutes * 60000);
        if (bStart < endTime && bEnd > startTime) {
            conflicts.push({
                type: "STAFF",
                source: "BOOKING",
                title: "Existing Appointment",
                startTime: bStart,
                endTime: bEnd
            });
        }
    }

    // 4. Check Staff Course Sessions (as teacher)
    const staffCourseSessions = await tx.courseSession.findMany({
        where: {
            courseClass: {
                teacher: {
                    userId: staffId
                }
            },
            ...overlapCondition
        },
        include: { courseClass: true }
    });

    for (const session of staffCourseSessions) {
        conflicts.push({
            type: "STAFF",
            source: "COURSE_SESSION",
            title: `Class: ${session.courseClass.name || session.title}`,
            startTime: session.startTime,
            endTime: session.endTime
        });
    }

    // 5. Check Staff Blocked/Unavailable Periods
    // Assuming AvailabilityOverride is isAvailable = false for blocked periods
    const reqDateStr = startTime.toISOString().split("T")[0]; // YYYY-MM-DD
    
    const overrides = await tx.availabilityOverride.findMany({
        where: {
            consultantId: staffId,
            date: reqDateStr,
            isAvailable: false
        }
    });

    for (const over of overrides) {
        // override startTime and endTime are likely "HH:mm" strings
        const overStartStr = `${reqDateStr}T${over.startTime}:00`;
        const overEndStr = `${reqDateStr}T${over.endTime}:00`;
        const overStart = new Date(overStartStr);
        const overEnd = new Date(overEndStr);

        if (overStart < endTime && overEnd > startTime) {
            conflicts.push({
                type: "STAFF",
                source: "UNAVAILABLE_PERIOD",
                title: "Staff is unavailable",
                startTime: overStart,
                endTime: overEnd
            });
        }
    }

    return {
        hasConflict: conflicts.length > 0,
        conflicts
    };
}
