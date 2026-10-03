import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientsClient, ClientCardData } from "./clients-client";

export const dynamic = "force-dynamic";

export default async function MyClientsPage() {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "CONSULTANT") {
        redirect("/login");
    }

    // Query distinct clients that have an enrollment assigned to this consultant
    const enrollments = await prisma.programEnrollment.findMany({
        where: {
            consultantId: session.user.id,
        },
        include: {
            client: {
                include: {
                    clientBookings: {
                        where: {
                            consultantId: session.user.id,
                            status: "COMPLETED",
                        },
                        orderBy: {
                            scheduledAt: "desc",
                        },
                        take: 1,
                    }
                }
            },
            programType: { include: { program: true } },
            documentRequirements: {
                include: {
                    documents: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    type EnrollmentType = typeof enrollments[0];
    
    // Group by client
    const clientsMap = new Map<string, { client: EnrollmentType["client"]; enrollments: EnrollmentType[] }>();
    for (const enrollment of enrollments) {
        const clientId = enrollment.clientId;
        if (!clientsMap.has(clientId)) {
            clientsMap.set(clientId, {
                client: enrollment.client,
                enrollments: [],
            });
        }
        clientsMap.get(clientId)!.enrollments.push(enrollment);
    }

    const clientCards: ClientCardData[] = Array.from(clientsMap.values()).map(({ client, enrollments }) => {
        // Use the most recent enrollment for the card status
        const activeEnrollment = enrollments[0];
        
        let programName = "Belum terdaftar program";
        let status = "Onboarding";
        let docCompleted = 0;
        let docTotal = 0;

        if (activeEnrollment) {
            programName = activeEnrollment.programType?.name || "Program";
            status = activeEnrollment.status === "ACTIVE" ? "Aktif" : (activeEnrollment.status === "PROCESSING" ? "Processing" : "Onboarding");
            
            docTotal = activeEnrollment.documentRequirements.length;
            docCompleted = activeEnrollment.documentRequirements.filter((req) => 
                req.documents.some((doc) => doc.status === "APPROVED")
            ).length;
        }

        const lastSession = client.clientBookings && client.clientBookings.length > 0 
            ? new Intl.DateTimeFormat("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }).format(new Date(client.clientBookings[0].scheduledAt))
            : "Belum ada sesi";

        return {
            id: client.id,
            name: client.name || "Client",
            program: programName,
            lastSession,
            docStatus: { completed: docCompleted, total: docTotal },
            status,
        };
    });

    return <ClientsClient clients={clientCards} />;
}