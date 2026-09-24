import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentsClient, ClientDocument, DocumentStatus } from "./documents-client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, S3_BUCKET } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  console.log('iddddddd: ', session.user.id);


  // Find active program enrollment
  const activeEnrollment = await prisma.programEnrollment.findFirst({
    where: {
      studentId: session.user.id,
      // studentId: "5d0062d5-47ad-450e-824a-c62c09efb8eb",
      status: { in: ["ONBOARDING", "PROCESSING", "ACTIVE"] },
    },
    include: {
      documentRequirements: {
        include: {
          documents: {
            where: {
              studentId: session.user.id,
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!activeEnrollment) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center mt-20">
        <h2 className="text-lg font-semibold text-slate-800">Tidak ada pendaftaran program aktif</h2>
        <p className="text-slate-500 mt-2">Anda perlu mendaftar ke sebuah program untuk mengelola dokumen persyaratan.</p>
      </div>
    );
  }

  // Format into ClientDocument[]
  const clientDocuments: ClientDocument[] = await Promise.all(
    activeEnrollment.documentRequirements.map(async (req) => {
      const doc = req.documents[0]; // get the latest uploaded document for this requirement
      let fileUrl = null;

      // generate presigned download URL if there is an objectKey
      if (doc?.objectKey) {
        try {
          const command = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: doc.objectKey,
          });
          fileUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        } catch (e) {
          console.error("Failed to generate download URL for doc", doc.id);
        }
      }

      return {
        requirementId: req.id,
        code: req.code,
        title: req.name,
        description: req.description,
        isRequired: req.isRequired,
        documentId: doc?.id || null,
        status: (doc?.status as DocumentStatus) || "NOT_UPLOADED",
        fileName: doc?.fileName || null,
        fileUrl,
        uploadedAt: doc?.createdAt ? new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(doc.createdAt) : null,
        revisionNote: doc?.revisionNote || null,
      };
    })
  );

  return (
    <DocumentsClient
      documents={clientDocuments}
      enrollmentId={activeEnrollment.id}
    />
  );
}