"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export type ClientEnrollmentSummary = Extract<Awaited<ReturnType<typeof getClientEnrollments>>, { success: true }>["data"][0];
export type ClientEnrollmentDetail = Extract<Awaited<ReturnType<typeof getClientEnrollment>>, { success: true }>["data"];
export type ClientCourseEnrollmentDetail = Extract<Awaited<ReturnType<typeof getClientCourseEnrollment>>, { success: true }>["data"];
export type ClientDocumentRequirement = Extract<Awaited<ReturnType<typeof getClientDocuments>>, { success: true }>["data"][0];
export type ClientCourseSummary = Extract<Awaited<ReturnType<typeof getClientClasses>>, { success: true }>["data"][0];
export type ClientAdvisorySession = Extract<Awaited<ReturnType<typeof getClientAdvisorySessions>>, { success: true }>["data"][0];

// Prisma payload types removed. Will use return type inference.

/**
 * Validates that the current user is an authenticated CLIENT.
 * Returns the session if valid.
 */
async function getClientSession() {
    const session = await auth();
    if (!session || session.user.role !== "CLIENT") {
        throw new Error("UNAUTHORIZED");
    }
    return session;
}

/**
 * Fetch lightweight enrollment summary for the Dashboard
 */
export async function getClientDashboard() {
    try {
        const session = await getClientSession();
        
        const enrollments = await prisma.programEnrollment.findMany({
            where: { clientId: session.user.id },
            select: {
                id: true,
                status: true,
                enrolledAt: true,
                programType: {
                    select: {
                        name: true,
                        deliveryType: true,
                        program: {
                            select: { name: true }
                        }
                    }
                },
                consultant: {
                    select: { id: true, name: true }
                },
                documentRequirements: {
                    select: {
                        id: true,
                        documents: {
                            select: { status: true },
                            orderBy: { createdAt: "desc" },
                            take: 1
                        }
                    }
                },
                courseEnrollments: {
                    select: {
                        id: true,
                        courseClass: {
                            select: {
                                name: true,
                                course: { select: { name: true } },
                                teacher: { include: { user: { select: { name: true } } } },
                                schedulePatterns: {
                                    select: {
                                        dayOfWeek: true,
                                        startTime: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { enrolledAt: "desc" }
        });

        // Format for dashboard
        const formatted = enrollments.map(e => {
            const completedDocs = e.documentRequirements.filter(req => 
                req.documents[0]?.status === "APPROVED"
            ).length;

            return {
                id: e.id,
                programName: e.programType.program.name,
                programTypeName: e.programType.name,
                deliveryType: e.programType.deliveryType,
                status: e.status,
                enrolledAt: e.enrolledAt,
                consultant: e.consultant,
                documentProgress: {
                    completed: completedDocs,
                    total: e.documentRequirements.length
                },
                courseClass: e.courseEnrollments[0]?.courseClass || null,
                courseEnrollmentId: e.courseEnrollments[0]?.id || null,
            };
        });

        return { success: true as const, data: formatted };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get all enrollments for My Services list
 */
export async function getClientEnrollments() {
    try {
        const session = await getClientSession();
        
        const enrollments = await prisma.programEnrollment.findMany({
            where: { clientId: session.user.id },
            select: {
                id: true,
                status: true,
                enrolledAt: true,
                programType: {
                    select: {
                        name: true,
                        deliveryType: true,
                        program: {
                            select: { name: true }
                        }
                    }
                },
                consultant: {
                    select: { id: true, name: true }
                },
                courseEnrollments: {
                    select: {
                        id: true,
                        courseClass: {
                            select: {
                                name: true,
                                teacher: { include: { user: { select: { name: true } } } },
                            }
                        }
                    }
                }
            },
            orderBy: { enrolledAt: "desc" }
        });

        return { success: true as const, data: enrollments };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get detailed enrollment context
 */
export async function getClientEnrollment(enrollmentId: string) {
    try {
        const session = await getClientSession();
        
        const enrollment = await prisma.programEnrollment.findFirst({
            where: { 
                id: enrollmentId,
                clientId: session.user.id
            },
            include: {
                programType: {
                    include: {
                        program: true
                    }
                },
                consultant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                },
                courseEnrollments: {
                    include: {
                        courseClass: {
                            include: {
                                course: true,
                                teacher: { include: { user: { select: { id: true, name: true } } } }
                            }
                        }
                    }
                }
            }
        });

        if (!enrollment) {
            return { success: false as const, error: "Enrollment not found or unauthorized" };
        }

        return { success: true as const, data: enrollment };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get all course enrollments for the client's classes
 */
export async function getClientClasses() {
    try {
        const session = await getClientSession();
        
        const classes = await prisma.courseEnrollment.findMany({
            where: { clientId: session.user.id },
            include: {
                programEnrollment: {
                    select: {
                        programType: {
                            select: { name: true, deliveryType: true }
                        }
                    }
                },
                courseClass: {
                    include: {
                        course: true,
                        teacher: { include: { user: { select: { id: true, name: true } } } },
                        schedulePatterns: true,
                        sessions: {
                            orderBy: { startTime: "desc" },
                            take: 1,
                            select: { id: true }
                        }
                    }
                }
            },
            orderBy: { startedAt: "desc" }
        });

        return { success: true as const, data: classes };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get detailed course enrollment context (Class Detail)
 */
export async function getClientCourseEnrollment(courseEnrollmentId: string) {
    try {
        const session = await getClientSession();
        
        const enrollment = await prisma.courseEnrollment.findFirst({
            where: { 
                id: courseEnrollmentId,
                clientId: session.user.id
            },
            include: {
                programEnrollment: {
                    select: {
                        programType: {
                            select: { name: true, deliveryType: true }
                        }
                    }
                },
                courseClass: {
                    include: {
                        course: true,
                        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
                        schedulePatterns: true,
                        sessions: {
                            orderBy: { startTime: "asc" },
                            include: {
                                attendances: {
                                    where: { clientId: session.user.id }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!enrollment) {
            return { success: false as const, error: "Course enrollment not found or unauthorized" };
        }

        return { success: true as const, data: enrollment };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get all document requirements grouped by enrollment for the documents page
 */
export async function getClientDocuments() {
    try {
        const session = await getClientSession();
        
        const enrollments = await prisma.programEnrollment.findMany({
            where: { clientId: session.user.id },
            select: {
                id: true,
                status: true,
                programType: {
                    select: { name: true, deliveryType: true, program: { select: { name: true } } }
                },
                documentRequirements: {
                    include: {
                        documents: {
                            include: { clientDocument: true },
                            orderBy: { createdAt: "desc" },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { enrolledAt: "desc" }
        });
        const withDocs = enrollments.filter(e => e.documentRequirements.length > 0);

        return { success: true as const, data: withDocs };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get all advisory sessions (bookings) and match them to services based on consultantId
 */
export async function getClientAdvisorySessions() {
    try {
        const session = await getClientSession();
        
        // Fetch enrollments that have a consultant assigned (SERVICE type)
        const enrollments = await prisma.programEnrollment.findMany({
            where: { 
                clientId: session.user.id,
                consultantId: { not: null }
            },
            select: {
                id: true,
                consultantId: true,
                programType: {
                    select: { name: true, deliveryType: true }
                }
            }
        });
        
        // Fetch all bookings for this client
        const bookings = await prisma.clientBooking.findMany({
            where: { clientId: session.user.id },
            include: {
                consultant: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { scheduledAt: "asc" }
        });

        // Map bookings to their related enrollment based on consultantId
        const mappedBookings = bookings.map(booking => {
            const relatedEnrollment = enrollments.find(e => e.consultantId === booking.consultantId);
            return {
                ...booking,
                serviceName: relatedEnrollment ? relatedEnrollment.programType.name : "General Advisory",
                enrollmentId: relatedEnrollment ? relatedEnrollment.id : null
            };
        });

        return { success: true as const, data: mappedBookings };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

export type ClientScheduleItem = {
    id: string;
    type: "BOOKING" | "COURSE_SESSION";
    title: string;
    contextName: string | null;
    startTime: Date;
    endTime: Date;
    durationMinutes: number;
    status: string;
    meetingUrl: string | null;
    staffName: string;
    notes?: string | null;
    enrollmentId?: string | null;
};

export async function getClientSchedule() {
    try {
        const session = await getClientSession();
        
        // 1. Fetch Bookings
        const bookings = await prisma.clientBooking.findMany({
            where: { clientId: session.user.id },
            include: { 
                consultant: { select: { id: true, name: true } },
                meetingNotes: { select: { content: true } }
            }
        });

        const enrollments = await prisma.programEnrollment.findMany({
            where: { 
                clientId: session.user.id,
                consultantId: { not: null }
            },
            select: { id: true, consultantId: true, programType: { select: { name: true } } }
        });

        // 2. Fetch Course Sessions
        const courseSessions = await prisma.courseSession.findMany({
            where: {
                courseClass: {
                    enrollments: { some: { clientId: session.user.id, status: "ACTIVE" } }
                }
            },
            include: {
                courseClass: { include: { teacher: true, course: true } }
            }
        });

        const schedule: ClientScheduleItem[] = [];

        // Map Bookings
        for (const b of bookings) {
            const related = enrollments.find(e => e.consultantId === b.consultantId);
            
            // Extract notes content if any
            let sessionNote = b.notes;
            if (b.meetingNotes && b.meetingNotes.length > 0) {
                try {
                    const parsedNotes = JSON.parse(b.meetingNotes[0].content);
                    if (parsedNotes.notes) {
                        sessionNote = parsedNotes.notes;
                    }
                } catch (e) {
                    sessionNote = b.meetingNotes[0].content;
                }
            }

            schedule.push({
                id: b.id,
                type: "BOOKING",
                title: b.sessionType, // ACADEMIC, CONSULTATION, etc
                contextName: related ? related.programType.name : "Advisory",
                startTime: b.scheduledAt,
                endTime: new Date(b.scheduledAt.getTime() + b.durationMinutes * 60000),
                durationMinutes: b.durationMinutes,
                status: b.status,
                meetingUrl: b.meetingUrl,
                staffName: b.consultant.name || "Staff",
                notes: sessionNote,
                enrollmentId: related ? related.id : null,
            });
        }

        // Map Course Sessions
        for (const s of courseSessions) {
            const duration = Math.round((s.endTime.getTime() - s.startTime.getTime()) / 60000);
            
            const now = new Date();
            let status = "CONFIRMED";
            if (s.endTime < now) status = "COMPLETED";

            schedule.push({
                id: s.id,
                type: "COURSE_SESSION",
                title: s.title,
                contextName: s.courseClass.course.name,
                startTime: s.startTime,
                endTime: s.endTime,
                durationMinutes: duration,
                status: status,
                meetingUrl: s.meetingUrl,
                staffName: s.courseClass.teacher.fullName || "Teacher",
                notes: null,
            });
        }

        schedule.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

        return { success: true as const, data: schedule };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}
