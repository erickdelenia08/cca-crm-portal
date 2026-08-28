// src/app/api/test-minio/route.ts
import { NextResponse } from 'next/server';
import { minioClient } from '@/lib/minio';

export async function GET() {
    const bucketName = process.env.MINIO_BUCKET_NAME || 'student-portal-files';

    try {
        // 1. Cek apakah bucket sudah ada, jika belum buat otomatis
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
        }

        // 2. Upload file teks sederhana untuk pengujian
        const testFileName = `test-${Date.now()}.txt`;
        const testContent = 'Koneksi Next.js ke MinIO Docker Berhasil!';

        await minioClient.putObject(
            bucketName,
            testFileName,
            Buffer.from(testContent),
            testContent.length,
            { 'Content-Type': 'text/plain' }
        );

        return NextResponse.json({
            success: true,
            message: 'Upload file ke MinIO Docker sukses 100%!',
            bucket: bucketName,
            fileName: testFileName,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}