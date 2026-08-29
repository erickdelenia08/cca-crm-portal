'use client'
import React, { useState } from 'react';
import {
  CloudUpload,
  Upload,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ChevronRight,
  Info,
  XCircle
} from 'lucide-react';

const DocumentManagementUI = () => {
  // Master State Dokumen
  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      name: 'Paspor (Passport)',
      code: 'PASSPORT',
      fileName: 'Passport_JohnDoe.pdf',
      fileSize: '2.4 MB',
      uploadDate: '12 Feb 2026',
      status: 'Revision Required', // Approved, Processing, Verification, Revision Required
      reviewer: 'Visa Processing Dept',
      note: 'Halaman identitas terpotong, mohon unggah ulang seluruh halaman paspor dengan jelas.',
      steps: [
        { label: 'File Uploaded', status: 'completed', time: '12 Feb 2026, 10:00' },
        { label: 'Document Verification', status: 'completed', time: '12 Feb 2026, 14:30' },
        { label: 'Visa Processing', status: 'rejected', time: '13 Feb 2026, 09:15' },
        { label: 'Final Approval', status: 'pending', time: '-' }
      ]
    },
    {
      id: 'doc-2',
      name: 'Transkrip Nilai (Academic Transcript)',
      code: 'TRANSCRIPT',
      fileName: 'Transcript_S1_Official.pdf',
      fileSize: '4.1 MB',
      uploadDate: '10 Feb 2026',
      status: 'Processing',
      reviewer: 'Academic Affairs',
      note: null,
      steps: [
        { label: 'File Uploaded', status: 'completed', time: '10 Feb 2026, 11:20' },
        { label: 'Document Verification', status: 'completed', time: '11 Feb 2026, 08:00' },
        { label: 'Academic Verification', status: 'current', time: 'In Progress' },
        { label: 'Final Approval', status: 'pending', time: '-' }
      ]
    },
    {
      id: 'doc-3',
      name: 'Sertifikat Bahasa (TOEFL/IELTS)',
      code: 'LANGUAGE',
      fileName: 'IELTS_Certificate_2025.pdf',
      fileSize: '1.8 MB',
      uploadDate: '08 Feb 2026',
      status: 'Approved',
      reviewer: 'Admissions Office',
      note: null,
      steps: [
        { label: 'File Uploaded', status: 'completed', time: '08 Feb 2026, 09:00' },
        { label: 'Document Verification', status: 'completed', time: '08 Feb 2026, 13:00' },
        { label: 'Language Score Verification', status: 'completed', time: '09 Feb 2026, 10:30' },
        { label: 'Final Approval', status: 'completed', time: '09 Feb 2026, 11:00' }
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('PASSPORT');
  const [activeDocId, setActiveDocId] = useState('doc-1');

  // Mendapatkan dokumen aktif untuk Tracker & Revision Box
  const activeDoc = documents.find(doc => doc.id === activeDocId) || documents[0];
  const revisionDocs = documents.filter(doc => doc.status === 'Revision Required');

  // Utility badge warna status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> Disetujui</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"><Clock className="w-3.5 h-3.5 animate-spin" /> Diproses</span>;
      case 'Revision Required':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><AlertTriangle className="w-3.5 h-3.5" /> Perlu Revisi</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">Menunggu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pusat Unggah & Verifikasi Dokumen</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola, lacak status, dan atasi revisi berkas administrasi Anda dalam satu tempat.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
              Total Berkas: {documents.length}
            </span>
          </div>
        </div>

        {/* Global Alert Box: Catatan Revisi (Jika Ada) */}
        {revisionDocs.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-amber-900">Perhatian: Diperlukan Tindakan Revisi Dokumen</h3>
                <p className="text-sm text-amber-700 mt-0.5">Beberapa berkas yang Anda unggah membutuhkan perbaikan sebelum dapat diproses lebih lanjut.</p>

                <div className="mt-4 space-y-3">
                  {revisionDocs.map((doc) => (
                    <div key={doc.id} className="bg-white/80 backdrop-blur border border-amber-200 p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-800">{doc.name}</span>
                          <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-medium">Oleh: {doc.reviewer}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>&ldquot;{doc.note}&rdquot;</span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory(doc.code);
                          setActiveDocId(doc.id);
                        }}
                        className="self-start md:self-center shrink-0 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Unggah Ulang Sekarang
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Panel Kiri (2 Kolom): Upload & List Dokumen */}
          <div className="lg:col-span-2 space-y-6">

            {/* Form Upload & Dropzone */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CloudUpload className="w-5 h-5 text-blue-600" /> Unggah Berkas Baru
              </h2>

              <div className="space-y-4">
                {/* Categorization Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    1. Pilih Kategori Dokumen
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  >
                    <option value="PASSPORT">Paspor (Passport)</option>
                    <option value="TRANSCRIPT">Transkrip Nilai (Academic Transcript)</option>
                    <option value="LANGUAGE">Sertifikat Bahasa (TOEFL/IELTS)</option>
                    <option value="OTHER">Dokumen Pendukung Lainnya</option>
                  </select>
                </div>

                {/* Drag and Drop Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    2. Tarik & Lepas Berkas
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-6 text-center transition-all duration-200 group cursor-pointer flex flex-col items-center justify-center min-h-[180px]">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      Klik untuk memilih atau seret berkas ke area ini
                    </p>
                    <p className="text-xs text-slate-400 mb-4">
                      Format disarankan: PDF, JPG, PNG (Maksimal 5MB)
                    </p>
                    <button className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl shadow-sm transition-colors">
                      Pilih Berkas Komputer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Master Document Table / List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Daftar Berkas Terunggah</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Klik pada baris dokumen untuk melihat detail tracker status.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Dokumen</th>
                      <th className="py-3.5 px-6">File</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {documents.map((doc) => {
                      const isSelected = doc.id === activeDocId;
                      return (
                        <tr
                          key={doc.id}
                          onClick={() => setActiveDocId(doc.id)}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/40 font-medium' : 'hover:bg-slate-50/80'
                            }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{doc.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Ditinjau oleh: {doc.reviewer}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-xs font-medium text-slate-700 truncate max-w-[140px]">{doc.fileName}</p>
                            <p className="text-[11px] text-slate-400">{doc.fileSize} • {doc.uploadDate}</p>
                          </td>
                          <td className="py-4 px-6">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                title="Preview File"
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                title="Re-upload"
                                onClick={() => {
                                  setSelectedCategory(doc.code);
                                  setActiveDocId(doc.id);
                                }}
                                className="p-2 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Panel Kanan (1 Kolom): Active Stepper Status */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 sticky top-6">
              <div className="pb-4 mb-5 border-b border-slate-100">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                  Status Dokumen Aktif
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{activeDoc.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">File: {activeDoc.fileName}</p>
              </div>

              {/* Vertical Stepper Tracker */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeDoc.steps.map((step, idx) => {
                  let icon = <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />;
                  let borderClass = "border-slate-200 bg-white";

                  if (step.status === 'completed') {
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
                    borderClass = "border-emerald-100 bg-emerald-50";
                  } else if (step.status === 'rejected') {
                    icon = <XCircle className="w-5 h-5 text-amber-600" />;
                    borderClass = "border-amber-100 bg-amber-50";
                  } else if (step.status === 'current') {
                    icon = <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
                    borderClass = "border-blue-200 bg-blue-50";
                  }

                  return (
                    <div key={idx} className="relative flex items-start gap-3 group">
                      {/* Step Indicator Dot */}
                      <div className={`absolute -left-6 top-0.5 rounded-full p-0.5 flex items-center justify-center ${borderClass}`}>
                        {icon}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1">
                        <p className={`text-xs font-semibold ${step.status === 'completed' ? 'text-slate-800' :
                          step.status === 'rejected' ? 'text-amber-900' :
                            step.status === 'current' ? 'text-blue-700' : 'text-slate-400'
                          }`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{step.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button inside tracker */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="w-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                  Buka Riwayat Aktivitas Lengkap <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DocumentManagementUI;