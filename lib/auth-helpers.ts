import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function canViewClientDocument(documentId: string): Promise<boolean> {
    const session = await auth();
    if (!session?.user) return false;

    const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
            enrollment: { include: { programType: true } }
        }
    });

    if (!document) return false;

    const role = session.user.role;
    const userId = session.user.id;

    if (role === "MANAGEMENT" || role === "PROCESSING_DEPARTMENT") {
        return document.enrollment.programType.deliveryType === "SERVICE";
    }

    if (role === "CLIENT") {
        return document.clientId === userId;
    }

    if (role === "CONSULTANT") {
        return document.enrollment.consultantId === userId;
    }

    // Teacher not given access to Client Documents for now
    return false;
}

export async function canReviewDocument(documentId: string): Promise<boolean> {
    const session = await auth();
    if (!session?.user) return false;

    const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
            enrollment: { include: { programType: true } }
        }
    });

    if (!document) return false;

    const role = session.user.role;

    if (role === "MANAGEMENT" || role === "PROCESSING_DEPARTMENT") {
        return document.enrollment.programType.deliveryType === "SERVICE";
    }

    return false;
}
