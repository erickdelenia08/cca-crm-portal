// src/services/document.service.ts

import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { prisma } from "@/lib/prisma";
import { s3, S3_BUCKET } from "@/lib/s3";

export async function createDocumentUploadUrl({
    studentId,
    fileName,
    contentType,
}: {
    studentId: string;
    fileName: string;
    contentType: string;
}) {
    const extension = fileName.includes(".")
        ? fileName.split(".").pop()
        : "";

    const uniqueName = `${crypto.randomUUID()}${extension ? `.${extension}` : ""
        }`;

    const key =
        `students/${studentId}/documents/${uniqueName}`;

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(
        s3,
        command,
        {
            expiresIn: 300,
        }
    );

    return {
        uploadUrl,
        key,
    };
}

export async function createDocument({
    studentId,
    title,
    fileKey,
    enrollmentId,
    enrollmentDocumentRequirementId,
    fileName,
    mimeType,
    fileSize,
    uploadedById,
}: {
    studentId: string;
    title: string;
    fileKey: string;
    enrollmentId: string;
    enrollmentDocumentRequirementId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    uploadedById: string;
}) {
    return prisma.document.create({
        data: {
            studentId,
            title,
            objectKey: fileKey,
            enrollmentId,
            enrollmentDocumentRequirementId,
            fileName,
            mimeType,
            fileSize,
            uploadedById,
            status: "SUBMITTED",

            history: {
                create: {
                    status: "SUBMITTED",
                    note: "Document submitted",
                    updatedBy: {
                        connect: {
                            id: studentId,
                        },
                    },
                },
            },
        },
        include: {
            history: true,
        },
    });
}


export async function getDocument(
    documentId: string
) {
    return prisma.document.findUnique({
        where: {
            id: documentId,
        },
        include: {
            student: {
                include: {
                    user: true,
                },
            },
            history: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
}


export async function createDocumentDownloadUrl(
    documentId: string
) {
    const document =
        await prisma.document.findUnique({
            where: {
                id: documentId,
            },
        });

    if (!document) {
        throw new Error("Document not found");
    }

    const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: document.objectKey,
    });

    const downloadUrl =
        await getSignedUrl(
            s3,
            command,
            {
                expiresIn: 300,
            }
        );

    return downloadUrl;
}


export async function deleteDocument(
    documentId: string
) {
    const document =
        await prisma.document.findUnique({
            where: {
                id: documentId,
            },
        });

    if (!document) {
        throw new Error("Document not found");
    }

    // Hapus file dari MinIO
    await s3.send(
        new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: document.objectKey,
        })
    );

    // Kalau ada outcome file
    if (document.outcomeObjectKey) {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: document.outcomeObjectKey,
            })
        );
    }

    // Hapus Document + history
    await prisma.document.delete({
        where: {
            id: documentId,
        },
    });

    return document;
}

// export async function createDocument({
//   studentId,
//   title,
//   fileKey,
//   uploadedBy,
// }: {
//   studentId: string;
//   title: string;
//   fileKey: string;
//   uploadedBy: string;
// }) {
//   return prisma.document.create({
//     data: {
//       studentId,
//       title,
//       fileUrl: fileKey,
//       status: "SUBMITTED",

//       history: {
//         create: {
//           status: "SUBMITTED",
//           note: "Document submitted",
//           updatedBy: uploadedBy,
//         },
//       },
//     },
//   });
// }