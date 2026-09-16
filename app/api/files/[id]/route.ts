import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { deleteDocument } from "@/services/file.service";

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