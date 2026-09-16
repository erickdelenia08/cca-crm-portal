"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  AlertCircle,
  FilePlus,
  Ban
} from "lucide-react";

export type DocumentStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REVISION_REQUIRED"
  | "REJECTED"
  | "NOT_UPLOADED";

export interface ClientDocument {
  requirementId: string;
  code: string;
  title: string;
  description?: string | null;
  isRequired: boolean;
  documentId?: string | null;
  status: DocumentStatus;
  fileName?: string | null;
  fileUrl?: string | null;
  uploadedAt?: string | null;
  revisionNote?: string | null;
}

interface DocumentsClientProps {
  documents: ClientDocument[];
  enrollmentId: string;
}

export function DocumentsClient({ documents, enrollmentId }: DocumentsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ALL" | "REQUIRED" | "REVISION">("ALL");
  const [selectedDocForUpload, setSelectedDocForUpload] = useState<ClientDocument | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "REQUIRED") return doc.isRequired;
    if (activeTab === "REVISION") return doc.status === "REVISION_REQUIRED";
    return true;
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadFile || !selectedDocForUpload) return;

    setIsUploading(true);
    try {
      // 1. Get Presigned URL
      const urlRes = await fetch("/api/files/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: uploadFile.name,
          contentType: uploadFile.type,
          size: uploadFile.size,
        }),
      });

      if (!urlRes.ok) {
        const errorData = await urlRes.json();
        throw new Error(errorData.message || "Failed to get upload URL");
      }

      const { uploadUrl, key } = await urlRes.json();

      // 2. Upload to Minio
      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": uploadFile.type,
        },
        body: uploadFile,
      });

      if (!s3Res.ok) {
        throw new Error("Failed to upload file to storage");
      }

      // 3. Save to Database
      const saveRes = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName: uploadFile.name,
          title: selectedDocForUpload.title,
          key,
          mimeType: uploadFile.type,
          size: uploadFile.size,
          enrollmentId,
          enrollmentDocumentRequirementId: selectedDocForUpload.requirementId,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save document record");
      }

      // 4. Cleanup & Refresh state
      setUploadFile(null);
      setSelectedDocForUpload(null);
      router.refresh();
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Terjadi kesalahan saat mengunggah dokumen");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-slate-800">
      {/* Header Info Progres Dokumen */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Berkas & Dokumen Persyaratan
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Unggah seluruh kelengkapan berkas untuk proses pendaftaran kampus dan visa.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold text-slate-500">Kelengkapan Dokumen</span>
            <p className="text-sm font-bold text-slate-900">
              {documents.filter((d) => d.status === "APPROVED").length} dari {documents.filter((d) => d.isRequired).length} Wajib Terverifikasi
            </p>
          </div>
        </div>

        {/* Status Indicators Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{documents.filter((d) => d.status === "APPROVED").length} Disetujui</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50/50 border border-blue-100 p-2 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{documents.filter((d) => d.status === "SUBMITTED" || d.status === "UNDER_REVIEW").length} Menunggu Review</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50/50 border border-amber-100 p-2 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{documents.filter((d) => d.status === "REVISION_REQUIRED").length} Perlu Revisi</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-rose-50/50 border border-rose-100 p-2 rounded-lg">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{documents.filter((d) => d.status === "REJECTED").length} Ditolak</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 border border-slate-200 p-2 rounded-lg col-span-2 sm:col-span-1">
            <FilePlus className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{documents.filter((d) => d.status === "NOT_UPLOADED").length} Belum Upload</span>
          </div>
        </div>
      </div>

      {/* Modern Segmented Control */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Semua Dokumen ({documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("REQUIRED")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "REQUIRED"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Wajib ({documents.filter((d) => d.isRequired).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("REVISION")}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === "REVISION"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Perlu Revisi ({documents.filter((d) => d.status === "REVISION_REQUIRED").length})
          </button>
        </div>
      </div>

      {/* List Dokumen */}
      <div className="space-y-3">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.requirementId}
            className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{doc.title}</h3>
                    {doc.isRequired && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded">
                        Wajib
                      </span>
                    )}
                  </div>

                  {doc.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {doc.description}
                      {doc.uploadedAt && ` • Diunggah: ${doc.uploadedAt}`}
                    </p>
                  )}

                  {doc.fileName && (
                    <a
                      href={doc.fileUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline mt-1"
                    >
                      <span>{doc.fileName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Status Badge & Action */}
              <div className="flex items-center gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 justify-between sm:justify-end">
                {/* Status Badges Berdasarkan Enum Prisma */}
                {doc.status === "APPROVED" && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                  </span>
                )}
                {(doc.status === "SUBMITTED" || doc.status === "UNDER_REVIEW") && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    {doc.status === "UNDER_REVIEW" ? "Sedang Diperiksa" : "Menunggu Review"}
                  </span>
                )}
                {doc.status === "REVISION_REQUIRED" && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" /> Perlu Revisi
                  </span>
                )}
                {doc.status === "REJECTED" && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                    <Ban className="w-3.5 h-3.5" /> Ditolak
                  </span>
                )}
                {doc.status === "NOT_UPLOADED" && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                    Belum Upload
                  </span>
                )}

                {/* Upload Button */}
                {doc.status !== "APPROVED" && doc.status !== "SUBMITTED" && doc.status !== "UNDER_REVIEW" && (
                  <button
                    type="button"
                    onClick={() => setSelectedDocForUpload(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{doc.status === "REVISION_REQUIRED" || doc.status === "REJECTED" ? "Upload Ulang" : "Upload"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Note Catatan Revisi dari Verifikator */}
            {doc.status === "REVISION_REQUIRED" && doc.revisionNote && (
              <div className="flex gap-2 items-start bg-amber-50 border border-amber-200/80 p-3 rounded-lg text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Catatan Verifikator:</p>
                  <p className="text-[11px] leading-relaxed text-amber-800">{doc.revisionNote}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            Tidak ada dokumen yang dipersyaratkan saat ini.
          </div>
        )}
      </div>

      {/* Modal Upload / Revisi Dokumen */}
      {selectedDocForUpload && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-xl border border-slate-200 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedDocForUpload.status === "REVISION_REQUIRED" ? "Unggah Revisi Dokumen" : "Unggah Dokumen"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedDocForUpload(null);
                  setUploadFile(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-900">{selectedDocForUpload.title}</p>
              {selectedDocForUpload.description && (
                <p className="text-slate-500">{selectedDocForUpload.description}</p>
              )}
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Berkas (PDF / JPG / PNG / DOCX, maks. 5MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*,.docx"
                  onChange={handleFileChange}
                  required
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDocForUpload(null);
                    setUploadFile(null);
                  }}
                  className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || isUploading}
                  className={`px-4 py-2 text-white text-xs font-semibold rounded-lg transition-colors ${!uploadFile || isUploading
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isUploading ? "Mengunggah..." : "Simpan Dokumen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
