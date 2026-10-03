import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "@/lib/s3";
import { canViewClientDocument } from "@/lib/auth-helpers";

export async function GET(
    req: Request,
    context: { params: Promise<{ documentId: string }> }
) {
    try {
        const session = await auth();
        
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { documentId } = await context.params;

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                clientDocument: true,
                enrollment: { include: { programType: true } }
            }
        });

        if (!document || !document.clientDocument) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const isAuthorized = await canViewClientDocument(documentId);

        if (!isAuthorized) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const command = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: document.clientDocument.objectKey,
        });

        const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

        return NextResponse.redirect(downloadUrl);
    } catch (error: unknown) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
