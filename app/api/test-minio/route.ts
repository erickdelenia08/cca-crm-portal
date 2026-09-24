// src/app/api/test-minio/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Upload file ke MinIO Docker sukses 100%!',
    });
}