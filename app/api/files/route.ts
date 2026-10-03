import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createDocument } from "@/services/file.service";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const {
            originalName,
            title,
            key,
            mimeType,
            size,
            enrollmentId,
            enrollmentDocumentRequirementId,
        } = body;

        if (
            !originalName ||
            !key ||
            !mimeType ||
            !size ||
            !enrollmentId ||
            !enrollmentDocumentRequirementId
        ) {
            return NextResponse.json(
                {
                    message: "Data file tidak lengkap",
                },
                { status: 400 }
            );
        }

        const enrollment = await prisma.programEnrollment.findFirst({
            where: {
                id: enrollmentId,
                clientId: session.user.id
            }
        });

        if (!enrollment) {
            return NextResponse.json(
                { message: "Enrollment tidak ditemukan atau tidak diizinkan" },
                { status: 403 }
            );
        }

        const requirement = await prisma.enrollmentDocumentRequirement.findFirst({
            where: {
                id: enrollmentDocumentRequirementId,
                enrollmentId
            }
        });

        if (!requirement) {
            return NextResponse.json(
                { message: "Requirement tidak ditemukan pada enrollment ini" },
                { status: 400 }
            );
        }

        const file = await createDocument({
            studentId: session.user.id,
            title: title || originalName,
            fileKey: key,
            enrollmentId,
            enrollmentDocumentRequirementId,
            fileName: originalName,
            mimeType,
            fileSize: size,
            uploadedById: session.user.id,
        });

        return NextResponse.json(file, {
            status: 201,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Gagal menyimpan file",
            },
            { status: 500 }
        );
    }
}