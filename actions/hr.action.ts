"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "@/lib/s3";

const INTERNAL_ROLES = ["CONSULTANT", "TEACHER", "MANAGEMENT", "PROCESSING_DEPARTMENT"];

/**
 * Perform quick tap in (check in) for today.
 */
export async function tapIn() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        if (!INTERNAL_ROLES.includes(session.user.role)) {
            return { success: false, error: "Not an internal staff member" };
        }

        const staffProfile = await prisma.staffProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!staffProfile) {
            return { success: false, error: "Staff profile not found" };
        }

        // Determine today's date in local server timezone (or configured timezone).
        // Since we are running in Indonesia, we create a date representing today midnight.
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Check if already tapped in today
        const existingAttendance = await prisma.attendance.findUnique({
            where: {
                staffId_date: {
                    staffId: staffProfile.id,
                    date: today
                }
            }
        });

        if (existingAttendance) {
            return { success: true, message: "Already checked in", attendance: existingAttendance };
        }

        const newAttendance = await prisma.attendance.create({
            data: {
                staffId: staffProfile.id,
                recordedById: session.user.id,
                date: today,
                checkIn: now,
                status: "ON_TIME" // default status, late detection can be added later
            }
        });

        revalidatePath("/consultant");
        revalidatePath("/consultant/attendance");
        revalidatePath("/teacher");
        revalidatePath("/teacher/attendance");
        revalidatePath("/processor");
        revalidatePath("/processor/attendance");
        revalidatePath("/management");
        revalidatePath("/management/attendance");

        return { success: true, attendance: newAttendance };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

/**
 * Get attendance history for the authenticated staff.
 */
export async function getMyAttendanceHistory() {
    try {
        const session = await auth();
        if (!session?.user?.id || !INTERNAL_ROLES.includes(session.user.role)) {
            return { success: false, error: "Unauthorized" };
        }

        const staffProfile = await prisma.staffProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!staffProfile) {
            return { success: false, error: "Staff profile not found" };
        }

        const history = await prisma.attendance.findMany({
            where: { staffId: staffProfile.id },
            orderBy: { date: "desc" },
            take: 30
        });

        return { success: true, data: history };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

/**
 * Get today's attendance for the authenticated staff.
 */
export async function getTodayAttendance() {
    try {
        const session = await auth();
        if (!session?.user?.id || !INTERNAL_ROLES.includes(session.user.role)) {
            return { success: false, error: "Unauthorized" };
        }

        const staffProfile = await prisma.staffProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!staffProfile) {
            return { success: false, error: "Staff profile not found" };
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const attendance = await prisma.attendance.findUnique({
            where: {
                staffId_date: {
                    staffId: staffProfile.id,
                    date: today
                }
            }
        });

        return { success: true, data: attendance };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

/**
 * Get leave requests for the authenticated staff.
 */
export async function getMyLeaveRequests() {
    try {
        const session = await auth();
        if (!session?.user?.id || !INTERNAL_ROLES.includes(session.user.role)) {
            return { success: false, error: "Unauthorized" };
        }

        const staffProfile = await prisma.staffProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!staffProfile) {
            return { success: false, error: "Staff profile not found" };
        }

        const history = await prisma.leaveRequest.findMany({
            where: { staffId: staffProfile.id },
            orderBy: { createdAt: "desc" }
        });

        return { success: true, data: history };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export type SubmitLeaveInput = {
    type: "ANNUAL" | "SICK" | "PERSONAL" | "MATERNITY" | "OTHER";
    startDate: string;
    endDate: string;
    reason: string;
    attachmentObjectKey?: string;
    attachmentFileName?: string;
    attachmentMimeType?: string;
    attachmentFileSize?: number;
};

/**
 * Submit a new leave request for the authenticated staff.
 */
export async function submitLeaveRequest(input: SubmitLeaveInput) {
    try {
        const session = await auth();
        if (!session?.user?.id || !INTERNAL_ROLES.includes(session.user.role)) {
            return { success: false, error: "Unauthorized" };
        }

        const staffProfile = await prisma.staffProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!staffProfile) {
            return { success: false, error: "Staff profile not found" };
        }

        if (!input.startDate || !input.endDate || !input.type || !input.reason) {
            return { success: false, error: "Semua field harus diisi" };
        }

        const newLeave = await prisma.leaveRequest.create({
            data: {
                staffId: staffProfile.id,
                requestedById: session.user.id,
                type: input.type,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
                reason: input.reason,
                attachmentObjectKey: input.attachmentObjectKey || undefined,
                attachmentFileName: input.attachmentFileName || undefined,
                attachmentMimeType: input.attachmentMimeType || undefined,
                attachmentFileSize: input.attachmentFileSize || undefined,
                status: "PENDING"
            }
        });

        revalidatePath("/consultant/leave");
        revalidatePath("/teacher/leave");
        revalidatePath("/processor/leave");
        revalidatePath("/management/leave");

        return { success: true, data: newLeave };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function getLeaveAttachmentUploadUrl(fileName: string, mimeType: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || !INTERNAL_ROLES.includes(session.user.role)) {
            return { success: false, error: "Unauthorized" };
        }

        const extension = fileName.includes(".") ? fileName.split(".").pop() : "";
        const uniqueName = `${crypto.randomUUID()}${extension ? `.${extension}` : ""}`;
        const key = `hr/leaves/${session.user.id}/${uniqueName}`;

        const command = new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            ContentType: mimeType,
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        return { success: true, data: { uploadUrl, key } };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}

export async function getLeaveAttachmentDownloadUrl(requestId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || !INTERNAL_ROLES.includes(session.user.role)) {
            return { success: false, error: "Unauthorized" };
        }

        const leaveReq = await prisma.leaveRequest.findUnique({
            where: { id: requestId }
        });

        if (!leaveReq || !leaveReq.attachmentObjectKey) {
            return { success: false, error: "Attachment not found" };
        }

        const command = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: leaveReq.attachmentObjectKey,
        });

        const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        return { success: true, data: downloadUrl };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
    }
}
