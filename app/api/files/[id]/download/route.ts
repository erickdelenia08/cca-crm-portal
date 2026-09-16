import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { createDocumentDownloadUrl } from "@/services/file.service";

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

        const result = await createDocumentDownloadUrl(
            id,
        );

        return NextResponse.json(result);
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