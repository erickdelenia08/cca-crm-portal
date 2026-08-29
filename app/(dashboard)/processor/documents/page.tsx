"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  Eye,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Send,
  History,
  Download,
  ExternalLink,
} from "lucide-react";

// Tipe Data Dokumen
type DocumentStatus =
  | "Uploaded"
  | "Verification"
  | "Processing by Admin"
  | "Submitted"
  | "Approved"
  | "Needs Revision";

type DocumentItem = {
  id: string;
  studentName: string;
  docType: string;
  fileName: string;
  uploadDate: string;
  status: DocumentStatus;
  fileUrl: string;
  processedFileUrl?: string;
  notes?: string;
  history: { status: string; updatedBy: string; timestamp: string }[];
};

export default function DocumentQueuePage() {
  // Mock Data Dokumen
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "DOC-9921",
      studentName: "Siti Rahmawati",
      docType: "Transkrip Nilai Legalisir",
      fileName: "Transkrip_Siti_Final.pdf",
      uploadDate: "24 Agu 2026",
      status: "Verification",
      fileUrl: "#",
      notes: "",
      history: [
        { status: "Uploaded", updatedBy: "Siti Rahmawati (Siswa)", timestamp: "24 Agu 2026 10:15 WIB" },
        { status: "Verification", updatedBy: "Budi Santoso (Admin)", timestamp: "25 Agu 2026 09:00 WIB" },
      ],
    },
    {
      id: "DOC-9844",
      studentName: "Ahmad Fauzi",
      docType: "Sertifikat TOEFL iBT",
      fileName: "TOEFL_Ahmad_2026.pdf",
      uploadDate: "25 Agu 2026",
      status: "Processing by Admin",
      fileUrl: "#",
      processedFileUrl: "TOEFL_Translated_Ahmad.pdf",
      notes: "",
      history: [
        { status: "Uploaded", updatedBy: "Ahmad Fauzi (Siswa)", timestamp: "25 Agu 2026 14:20 WIB" },
        { status: "Verification", updatedBy: "Dewi Lestari (Admin)", timestamp: "26 Agu 2026 08:30 WIB" },
        { status: "Processing by Admin", updatedBy: "Dewi Lestari (Admin)", timestamp: "26 Agu 2026 11:00 WIB" },
      ],
    },
  ]);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDocType, setSelectedDocType] = useState<string>("All");

  // State Drawer Detail Dokumen
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [revisionNote, setRevisionNote] = useState("");
  const [attachedResultFile, setAttachedResultFile] = useState<File | null>(null);

  // Filter Logic
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
    const matchesType = selectedDocType === "All" || doc.docType === selectedDocType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handler Update Status Dokumen
  const handleUpdateStatus = (newStatus: DocumentStatus) => {
    if (!selectedDoc) return;

    const newHistoryEntry = {
      status: newStatus,
      updatedBy: "Tim Pengolah (Admin)",
      timestamp: new Date().toLocaleString("id-ID") + " WIB",
    };

    const updated = documents.map((doc) => {
      if (doc.id === selectedDoc.id) {
        return {
          ...doc,
          status: newStatus,
          notes: newStatus === "Needs Revision" ? revisionNote : doc.notes,
          processedFileUrl: attachedResultFile ? attachedResultFile.name : doc.processedFileUrl,
          history: [...doc.history, newHistoryEntry],
        };
      }
      return doc;
    });

    setDocuments(updated);
    setSelectedDoc({
      ...selectedDoc,
      status: newStatus,
      notes: newStatus === "Needs Revision" ? revisionNote : selectedDoc.notes,
      processedFileUrl: attachedResultFile ? attachedResultFile.name : selectedDoc.processedFileUrl,
      history: [...selectedDoc.history, newHistoryEntry],
    });

    alert(`Status dokumen [${selectedDoc.id}] diperbarui ke: ${newStatus}`);
  };

  const statusSteps: DocumentStatus[] = [
    "Uploaded",
    "Verification",
    "Processing by Admin",
    "Submitted",
    "Approved",
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Antrian Dokumen (Document Queue)</h1>
        <p className="text-sm text-slate-500 mt-1">Verifikasi, proses, dan perbarui status dokumen persyaratan siswa.</p>
      </div>

      {/* Baris Filter & Pencarian */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari siswa atau ID dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full text-xs font-medium border border-slate-300 rounded-lg py-2 pr-3 bg-white focus:outline-hidden focus:border-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
          >
            <option value="All">Semua Status</option>
            <option value="Uploaded">Uploaded</option>
            <option value="Verification">Verification</option>
            <option value="Processing by Admin">Processing by Admin</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Needs Revision">Needs Revision</option>
          </select>

          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-hidden focus:border-blue-500"
          >
            <option value="All">Semua Jenis Dokumen</option>
            <option value="Transkrip Nilai Legalisir">Transkrip Nilai</option>
            <option value="Sertifikat TOEFL iBT">Sertifikat Bahasa</option>
            <option value="Paspor">Paspor</option>
          </select>
        </div>
      </div>

      {/* Tabel Dokumen */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-4">ID & Siswa</th>
                <th className="p-4">Jenis Dokumen</th>
                <th className="p-4">Nama File Upload</th>
                <th className="p-4">Tanggal Upload</th>
                <th className="p-4">Status Saat Ini</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{doc.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{doc.id}</p>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{doc.docType}</td>
                  <td className="p-4 text-blue-600 underline truncate max-w-[200px]">{doc.fileName}</td>
                  <td className="p-4 text-slate-500">{doc.uploadDate}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${doc.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : doc.status === "Needs Revision"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-blue-800"
                        }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Verifikasi & Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER / MODAL DETAIL DOKUMEN */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6">
            {/* Header Drawer */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {selectedDoc.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedDoc.docType}</h2>
                <p className="text-xs text-slate-500">Siswa: {selectedDoc.studentName}</p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Status Dokumen */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Alur Tahapan Status
              </label>
              <div className="flex items-center gap-1 overflow-x-auto py-2">
                {statusSteps.map((step, idx) => {
                  const isCurrent = selectedDoc.status === step;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleUpdateStatus(step)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${isCurrent
                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      {step}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview File Siswa */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                File Dokumen Siswa
              </label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{selectedDoc.fileName}</p>
                    <p className="text-[10px] text-slate-400">Diupload: {selectedDoc.uploadDate}</p>
                  </div>
                </div>
                <a
                  href={selectedDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Preview File
                </a>
              </div>
            </div>

            {/* Form Catatan Revisi */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Catatan Revisi / Penolakan (Jika ada)
              </label>
              <textarea
                rows={3}
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="Tuliskan catatan perbaikan untuk siswa..."
                className="w-full text-xs border border-slate-300 rounded-lg p-3 bg-white focus:outline-hidden focus:border-blue-500 resize-none"
              ></textarea>
              <button
                onClick={() => handleUpdateStatus("Needs Revision")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Minta Revisi ke Siswa
              </button>
            </div>

            {/* Upload Dokumen Balasan / Hasil Olah Admin */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Upload Hasil Pengurusan / Terjemahan (Opsional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  onChange={(e) => setAttachedResultFile(e.target.files?.[0] || null)}
                  className="text-xs border border-slate-300 rounded-lg p-2 w-full"
                />
              </div>
              {selectedDoc.processedFileUrl && (
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> File terlampir: {selectedDoc.processedFileUrl}
                </p>
              )}
            </div>

            {/* Audit Trail / Riwayat Perubahan Status */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> Riwayat Audit Trail
              </label>
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 divide-y divide-slate-100">
                {selectedDoc.history.map((h, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 text-[11px] space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Status: {h.status}</span>
                      <span className="text-slate-400 font-normal">{h.timestamp}</span>
                    </div>
                    <p className="text-slate-500">Oleh: {h.updatedBy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}