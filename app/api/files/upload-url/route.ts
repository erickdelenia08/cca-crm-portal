// api/files/upload-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createDocumentUploadUrl } from "@/services/file.service";
import { auth } from "@/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB dalam Bytes

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    console.log('ini sessionnn');

    console.log(session);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fileName, contentType, size } = body;

    // 1. Validasi Keberadaan Field
    if (!fileName || !contentType || typeof size !== "number") {
      return NextResponse.json(
        { message: "fileName, contentType, dan size wajib diisi" },
        { status: 400 }
      );
    }

    // 2. Validasi Batas Ukuran File (Aturan 5MB)
    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran file melebihi batas maksimal 5MB" },
        { status: 400 }
      );
    }

    // 3. Panggil Service
    const result = await createDocumentUploadUrl({
      studentId: session.user.id,
      fileName,
      contentType,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload URL Error:", error);

    return NextResponse.json(
      { message: "Gagal membuat upload URL" },
      { status: 500 }
    );
  }
}