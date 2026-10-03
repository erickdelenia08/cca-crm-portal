"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export type TeacherDashboardSummary = Extract<Awaited<ReturnType<typeof getTeacherDashboard>>, { success: true }>["data"];
export type TeacherClassSummary = Extract<Awaited<ReturnType<typeof getTeacherClasses>>, { success: true }>["data"][0];
export type TeacherClassDetail = Extract<Awaited<ReturnType<typeof getTeacherClass>>, { success: true }>["data"];
export type TeacherStudentList = Extract<Awaited<ReturnType<typeof getTeacherClassStudents>>, { success: true }>["data"];
export type TeacherStudentDetail = Extract<Awaited<ReturnType<typeof getTeacherStudent>>, { success: true }>["data"];
export type TeacherSessionSummary = Extract<Awaited<ReturnType<typeof getTeacherSessions>>, { success: true }>["data"][0];
export type TeacherSessionDetail = Extract<Awaited<ReturnType<typeof getTeacherSession>>, { success: true }>["data"];
export type TeacherScheduleSession = Extract<Awaited<ReturnType<typeof getTeacherSchedule>>, { success: true }>["data"][0];
export type TeacherAttendanceRecords = Extract<Awaited<ReturnType<typeof getTeacherAttendance>>, { success: true }>["data"];
export type TeacherScheduleChangeRequest = Extract<Awaited<ReturnType<typeof getTeacherScheduleChangeRequests>>, { success: true }>["data"][0];
export type ManagementScheduleChangeRequest = Extract<Awaited<ReturnType<typeof getScheduleChangeRequests>>, { success: true }>["data"][0];

/**
 * Validates that the current user is an authenticated TEACHER.
 * Returns the staffProfile if valid.
 */
export async function getTeacherProfile() {
    const session = await auth();
    if (!session || session.user.role !== "TEACHER") {
        throw new Error("UNAUTHORIZED");
    }

    const staffProfile = await prisma.staffProfile.findUnique({
        where: { userId: session.user.id },
        include: { user: true }
    });

    if (!staffProfile) {
        throw new Error("STAFF_PROFILE_NOT_FOUND");
    }

    return staffProfile;
}

/**
 * Get dashboard summary for teacher
 */
export async function getTeacherDashboard() {
    try {
        const teacher = await getTeacherProfile();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Get class counts
        const classesCount = await prisma.courseClass.count({
            where: { teacherId: teacher.id, isActive: true }
        });

        // Get students count
        const studentsCount = await prisma.courseEnrollment.count({
            where: { courseClass: { teacherId: teacher.id, isActive: true }, status: "ACTIVE" }
        });

        // Get today's sessions
        const todaysSessions = await prisma.courseSession.findMany({
            where: { 
                courseClass: { teacherId: teacher.id },
                startTime: { gte: todayStart, lte: todayEnd }
            },
            include: {
                courseClass: {
                    select: { name: true, course: { select: { name: true } } }
                }
            },
            orderBy: { startTime: "asc" }
        });

        // Get upcoming sessions (next 7 days)
        const upcomingSessions = await prisma.courseSession.findMany({
            where: {
                courseClass: { teacherId: teacher.id },
                startTime: { gt: todayEnd, lte: new Date(todayEnd.getTime() + 7 * 24 * 60 * 60 * 1000) }
            },
            include: {
                courseClass: {
                    select: { name: true, course: { select: { name: true } } }
                }
            },
            orderBy: { startTime: "asc" },
            take: 10
        });

        // Pending attendance (sessions in the past without attendance recorded)
        // Simplified check: Sessions before now where attendances length is 0 (or just partial)
        // We'll count sessions where NOT ALL active enrollments have an attendance record.
        // For simplicity, count sessions where attendances count is 0.
        const pendingAttendanceCount = await prisma.courseSession.count({
            where: {
                courseClass: { teacherId: teacher.id },
                startTime: { lt: new Date() },
                attendances: { none: {} }
            }
        });

        return { 
            success: true as const, 
            data: {
                classesCount,
                studentsCount,
                todaysSessions,
                upcomingSessions,
                pendingAttendanceCount
            }
        };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get all active classes for the teacher
 */
export async function getTeacherClasses() {
    try {
        const teacher = await getTeacherProfile();

        const classes = await prisma.courseClass.findMany({
            where: { teacherId: teacher.id },
            include: {
                course: true,
                schedulePatterns: true,
                _count: {
                    select: { enrollments: { where: { status: "ACTIVE" } } }
                }
            },
            orderBy: { startDate: "desc" }
        });

        return { success: true as const, data: classes };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get detailed information for a specific class
 */
export async function getTeacherClass(classId: string) {
    try {
        const teacher = await getTeacherProfile();

        const courseClass = await prisma.courseClass.findFirst({
            where: { id: classId, teacherId: teacher.id },
            include: {
                course: true,
                schedulePatterns: true,
                _count: {
                    select: { enrollments: { where: { status: "ACTIVE" } } }
                }
            }
        });

        if (!courseClass) {
            return { success: false as const, error: "Class not found or unauthorized" };
        }

        return { success: true as const, data: courseClass };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get students for a specific class
 */
export async function getTeacherClassStudents(classId: string) {
    try {
        const teacher = await getTeacherProfile();

        // Verify class belongs to teacher
        const courseClass = await prisma.courseClass.findFirst({
            where: { id: classId, teacherId: teacher.id }
        });

        if (!courseClass) {
            return { success: false as const, error: "Class not found or unauthorized" };
        }

        const enrollments = await prisma.courseEnrollment.findMany({
            where: { courseClassId: classId },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        clientProfile: {
                            select: { phone: true }
                        }
                    }
                }
            },
            orderBy: { client: { name: "asc" } }
        });

        return { success: true as const, data: enrollments };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get detailed student info in context of a class
 */
export async function getTeacherStudent(classId: string, studentId: string) {
    try {
        const teacher = await getTeacherProfile();

        const enrollment = await prisma.courseEnrollment.findFirst({
            where: { 
                courseClassId: classId,
                clientId: studentId,
                courseClass: { teacherId: teacher.id }
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        clientProfile: {
                            select: { phone: true, dateOfBirth: true, address: true }
                        },
                        courseAttendances: {
                            where: { session: { courseClassId: classId } },
                            include: {
                                session: { select: { id: true, title: true, startTime: true } }
                            },
                            orderBy: { session: { startTime: "desc" } }
                        }
                    }
                }
            }
        });

        if (!enrollment) {
            return { success: false as const, error: "Student not found in this class" };
        }

        return { success: true as const, data: enrollment };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get sessions for a specific class
 */
export async function getTeacherSessions(classId: string) {
    try {
        const teacher = await getTeacherProfile();

        const sessions = await prisma.courseSession.findMany({
            where: { 
                courseClassId: classId,
                courseClass: { teacherId: teacher.id }
            },
            include: {
                _count: { select: { attendances: true } }
            },
            orderBy: { startTime: "asc" }
        });

        return { success: true as const, data: sessions };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get a specific session
 */
export async function getTeacherSession(classId: string, sessionId: string) {
    try {
        const teacher = await getTeacherProfile();

        const session = await prisma.courseSession.findFirst({
            where: { 
                id: sessionId,
                courseClassId: classId,
                courseClass: { teacherId: teacher.id }
            },
            include: {
                courseClass: {
                    include: { course: true }
                },
                materials: true,
                scheduleRequests: {
                    orderBy: { createdAt: "desc" },
                    take: 1
                }
            }
        });

        if (!session) {
            return { success: false as const, error: "Session not found or unauthorized" };
        }

        return { success: true as const, data: session };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get the teacher's schedule (upcoming sessions)
 */
export async function getTeacherSchedule() {
    try {
        const teacher = await getTeacherProfile();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const sessions = await prisma.courseSession.findMany({
            where: { 
                courseClass: { teacherId: teacher.id },
                startTime: { gte: todayStart }
            },
            include: {
                courseClass: {
                    select: { name: true, course: { select: { name: true } } }
                }
            },
            orderBy: { startTime: "asc" },
            take: 30 // Get next 30 sessions
        });

        return { success: true as const, data: sessions };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Request a schedule change for a session
 */
export async function createScheduleChangeRequest(data: {
    sessionId: string;
    requestedDate: string;
    requestedStartTime: string;
    requestedEndTime: string;
    requestedMode: "ONLINE" | "OFFLINE" | "HYBRID";
    requestedLocation?: string;
    requestedMeetingProvider?: "ZOOM" | "GOOGLE_MEET" | "OTHER";
    requestedMeetingUrl?: string;
    reason: string;
}) {
    try {
        const teacher = await getTeacherProfile();

        // Verify session belongs to teacher
        const session = await prisma.courseSession.findFirst({
            where: { 
                id: data.sessionId,
                courseClass: { teacherId: teacher.id }
            }
        });

        if (!session) {
            return { success: false as const, error: "Session not found or unauthorized" };
        }

        // Validate URL if provider is Google Meet
        if (data.requestedMode === "ONLINE" && data.requestedMeetingProvider === "GOOGLE_MEET") {
            if (!data.requestedMeetingUrl || !data.requestedMeetingUrl.includes("meet.google.com")) {
                return { success: false as const, error: "Valid Google Meet URL is required for online sessions" };
            }
        }

        // Combine date and time strings into Date objects
        // The client should send ISO strings or we construct it. Assuming client sends valid ISO or yyyy-MM-dd
        const reqDate = new Date(data.requestedDate);
        
        // Extract time parts (assuming HH:mm format)
        const startParts = data.requestedStartTime.split(":");
        const endParts = data.requestedEndTime.split(":");
        
        const startDateTime = new Date(reqDate);
        startDateTime.setHours(parseInt(startParts[0]), parseInt(startParts[1]), 0, 0);
        
        const endDateTime = new Date(reqDate);
        endDateTime.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0, 0);

        const request = await prisma.scheduleChangeRequest.create({
            data: {
                sessionId: session.id,
                requestedDate: reqDate,
                requestedStartTime: startDateTime,
                requestedEndTime: endDateTime,
                requestedMode: data.requestedMode,
                requestedLocation: data.requestedLocation,
                requestedMeetingProvider: data.requestedMeetingProvider,
                requestedMeetingUrl: data.requestedMeetingUrl,
                reason: data.reason,
                status: "PENDING"
            }
        });

        return { success: true as const, data: request };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get attendance records for a session
 */
export async function getTeacherAttendance(sessionId: string) {
    try {
        const teacher = await getTeacherProfile();

        const session = await prisma.courseSession.findFirst({
            where: {
                id: sessionId,
                courseClass: { teacherId: teacher.id }
            },
            include: {
                attendances: true
            }
        });

        if (!session) {
            return { success: false as const, error: "Session not found or unauthorized" };
        }

        return { success: true as const, data: session.attendances };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Save attendance for a session
 */
export async function saveTeacherAttendance(sessionId: string, attendances: { clientId: string, status: "ON_TIME" | "LATE" | "ABSENT" | "EXCUSED" }[]) {
    try {
        const teacher = await getTeacherProfile();

        const session = await prisma.courseSession.findFirst({
            where: {
                id: sessionId,
                courseClass: { teacherId: teacher.id }
            }
        });

        if (!session) {
            return { success: false as const, error: "Session not found or unauthorized" };
        }

        // Use a transaction to update all attendances safely
        const result = await prisma.$transaction(async (tx) => {
            const records = [];
            for (const att of attendances) {
                // Upsert based on session + client
                const existing = await tx.courseAttendance.findFirst({
                    where: { sessionId: session.id, clientId: att.clientId }
                });

                if (existing) {
                    records.push(await tx.courseAttendance.update({
                        where: { id: existing.id },
                        data: { status: att.status }
                    }));
                } else {
                    records.push(await tx.courseAttendance.create({
                        data: {
                            sessionId: session.id,
                            clientId: att.clientId,
                            status: att.status
                        }
                    }));
                }
            }
            return records;
        });

        return { success: true as const, data: result };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Get all schedule change requests for the teacher
 */
export async function getTeacherScheduleChangeRequests() {
    try {
        const teacher = await getTeacherProfile();

        const requests = await prisma.scheduleChangeRequest.findMany({
            where: {
                session: { courseClass: { teacherId: teacher.id } }
            },
            include: {
                session: {
                    include: { courseClass: { select: { name: true, code: true } } }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return { success: true as const, data: requests };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Cancel a pending schedule change request (Teacher)
 */
export async function cancelTeacherScheduleChangeRequest(requestId: string) {
    try {
        const teacher = await getTeacherProfile();

        const request = await prisma.scheduleChangeRequest.findFirst({
            where: {
                id: requestId,
                session: { courseClass: { teacherId: teacher.id } },
                status: "PENDING"
            }
        });

        if (!request) {
            return { success: false as const, error: "Request not found or not pending" };
        }

        const cancelled = await prisma.scheduleChangeRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED", reviewNote: "Cancelled by teacher" }
        });

        return { success: true as const, data: cancelled };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Management: Get all schedule change requests
 */
export async function getScheduleChangeRequests() {
    try {
        const userSession = await auth();
        if (!userSession || userSession.user.role !== "MANAGEMENT") {
            throw new Error("UNAUTHORIZED");
        }

        const requests = await prisma.scheduleChangeRequest.findMany({
            include: {
                session: {
                    include: {
                        courseClass: {
                            include: { teacher: { include: { user: true } } }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return { success: true as const, data: requests };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Management: Approve a schedule change request
 */
export async function approveScheduleChangeRequest(requestId: string) {
    try {
        const userSession = await auth();
        if (!userSession || userSession.user.role !== "MANAGEMENT") {
            throw new Error("UNAUTHORIZED");
        }

        const request = await prisma.scheduleChangeRequest.findFirst({
            where: { id: requestId, status: "PENDING" }
        });

        if (!request) return { success: false as const, error: "Request not found or not pending" };

        const result = await prisma.$transaction(async (tx) => {
            // Update session
            const updatedSession = await tx.courseSession.update({
                where: { id: request.sessionId },
                data: {
                    startTime: request.requestedStartTime,
                    endTime: request.requestedEndTime,
                    mode: request.requestedMode,
                    location: request.requestedLocation,
                    meetingProvider: request.requestedMeetingProvider,
                    meetingUrl: request.requestedMeetingUrl
                }
            });

            // Update request
            const updatedRequest = await tx.scheduleChangeRequest.update({
                where: { id: requestId },
                data: {
                    status: "APPROVED",
                    reviewedById: userSession.user.id,
                    reviewedAt: new Date()
                }
            });

            return { session: updatedSession, request: updatedRequest };
        });

        return { success: true as const, data: result };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}

/**
 * Management: Reject a schedule change request
 */
export async function rejectScheduleChangeRequest(requestId: string, reason: string) {
    try {
        const userSession = await auth();
        if (!userSession || userSession.user.role !== "MANAGEMENT") {
            throw new Error("UNAUTHORIZED");
        }

        const request = await prisma.scheduleChangeRequest.findFirst({
            where: { id: requestId, status: "PENDING" }
        });

        if (!request) return { success: false as const, error: "Request not found or not pending" };

        const updatedRequest = await prisma.scheduleChangeRequest.update({
            where: { id: requestId },
            data: {
                status: "REJECTED",
                reviewNote: reason,
                reviewedById: userSession.user.id,
                reviewedAt: new Date()
            }
        });

        return { success: true as const, data: updatedRequest };
    } catch (error: unknown) {
        return { success: false as const, error: error instanceof Error ? error.message : "Terjadi kesalahan" };
    }
}
