import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createDocument } from "@/services/file.service";

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