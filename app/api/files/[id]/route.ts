import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createDocumentDownloadUrl, deleteDocument } from "@/services/file.service";

export async function DELETE(
    req: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        await deleteDocument(
            id,
        );

        return NextResponse.json({
            message: "File berhasil dihapus",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "File tidak ditemukan",
            },
            { status: 404 }
        );
    }
}

export async function GET(
    req: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        // Memanggil fungsi presigned URL yang sudah ada di service
        const downloadUrl = await createDocumentDownloadUrl(id);

        // Redirect browser langsung ke presigned URL S3/MinIO
        return NextResponse.redirect(downloadUrl);
    } catch (error) {
        console.error("Error fetching preview URL:", error);

        return NextResponse.json(
            { message: "Dokumen tidak ditemukan atau gagal memuat URL" },
            { status: 404 }
        );
    }
}