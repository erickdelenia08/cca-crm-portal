import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientDetailClient } from "./client-detail-client";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "CONSULTANT") {
        redirect("/login");
    }

    const clientId = (await params).id;

    const client = await prisma.user.findFirst({
        where: { 
            id: clientId,
            clientEnrollments: {
                some: { consultantId: session.user.id }
            }
        },
        include: {
            clientProfile: true,
            clientEnrollments: {
                where: { status: { in: ["ONBOARDING", "PROCESSING", "ACTIVE"] } },
                include: {
                    documentRequirements: {
                        include: { documents: { orderBy: { createdAt: "desc" }, take: 1 } }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: 1
            },
            clientMeetingNotes: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!client) {
        return (
            <div className="p-6 text-center text-slate-500 mt-20">
                Klien tidak ditemukan atau bukan binaan Anda.
            </div>
        );
    }

    const profileData = {
        id: client.id,
        name: client.name || "Klien",
        email: client.email || "-",
        phone: client.clientProfile?.phone || "-",
        location: client.clientProfile?.address || "-",
        academic: client.clientProfile?.educationLevel || "-",
    };

    const documentsData = [];
    if (client.clientEnrollments[0]) {
        for (const req of client.clientEnrollments[0].documentRequirements) {
            const doc = req.documents[0];
            documentsData.push({
                id: req.id,
                name: req.name,
                status: doc?.status || "NOT_UPLOADED",
                date: doc?.createdAt ? new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                }).format(doc.createdAt) : "-",
            });
        }
    }

    const notesData = client.clientMeetingNotes.map(note => {
        let content = note.content;
        try {
            const parsed = JSON.parse(note.content);
            content = parsed.notes || note.content;
        } catch (e) { }

        return {
            id: note.id,
            date: new Intl.DateTimeFormat("id-ID", {
                day: "numeric", month: "short", year: "numeric"
            }).format(note.createdAt),
            author: note.consultantId === session.user.id ? "Anda" : "Konsultan Lain",
            content,
        };
    });

    return (
        <ClientDetailClient
            profile={profileData}
            documents={documentsData}
            initialNotes={notesData}
        />
    );
}