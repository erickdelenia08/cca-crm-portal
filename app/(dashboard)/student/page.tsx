import Link from "next/link";
import {
  CalendarDays,
  FolderOpen,
  Megaphone,
  PlusCircle,
  Upload,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function StudentDashboardPage() {
  // Simulasi data dari backend/state
  const upcomingSession = {
    id: "1",
    type: "Konsultasi", // atau "Les"
    consultantName: "Sarah J.",
    dateTime: "24 Aug 2026, 10:00 AM",
  };

  const latestDocumentStatus = {
    status: "Verification", // e.g. "Approved", "Verification", "Rejected"
    summary: "Dokumen Transkrip Nilai sedang diverifikasi oleh tim.",
  };

  const todayDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(new Date());

  return (
    <div className="flex-1 overflow-y-auto space-y-7 p-6">
      {/* 1. Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary text-on-primary rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Halo, Budi!
          </h1>
          <p className="text-sm text-primary-fixed-dim mt-1">{todayDate}</p>
        </div>

        {/* 5. Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/student/bookings"
            className="bg-secondary text-on-secondary font-medium text-xs md:text-sm px-4 py-2.5 rounded-lg hover:bg-secondary-container transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book a Session</span>
          </Link>
          <Link
            href="/student/documents"
            className="bg-surface-container-lowest text-on-surface font-medium text-xs md:text-sm px-4 py-2.5 rounded-lg hover:bg-surface-container-high transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-primary" />
            <span>Upload Dokumen</span>
          </Link>
        </div>
      </div>

      {/* Grid Layout Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2. Card: Sesi Terdekat */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-info-container text-on-info-container p-2 rounded-lg">
                      <CalendarDays className="w-5 h-5" />
                    </span>
                    <h3 className="font-semibold text-base text-on-surface">
                      Sesi Terdekat
                    </h3>
                  </div>
                  {upcomingSession && (
                    <span className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-2.5 py-1 rounded-full">
                      {upcomingSession.type}
                    </span>
                  )}
                </div>

                {upcomingSession ? (
                  <div className="mb-4 space-y-1">
                    <p className="text-lg font-bold text-primary">
                      {upcomingSession.dateTime}
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      Konsultan:{" "}
                      <span className="font-medium text-on-surface">
                        {upcomingSession.consultantName}
                      </span>
                    </p>
                  </div>
                ) : (
                  /* Empty State jika tidak ada sesi mendatang */
                  <div className="my-4 text-center py-4">
                    <p className="text-sm text-on-surface-variant mb-3">
                      Belum ada sesi yang dijadwalkan.
                    </p>
                    <Link
                      href="/student/bookings"
                      className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Book a Session <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {upcomingSession && (
                <Link
                  href="/student/bookings"
                  className="w-full bg-primary text-on-primary text-sm font-medium py-2 rounded-lg hover:bg-primary-container transition-colors flex justify-center items-center gap-2 text-center"
                >
                  Lihat Detail
                </Link>
              )}
            </div>

            {/* 3. Card: Status Dokumen */}
            <Link
              href="/student/documents"
              className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-sm hover:border-primary transition-colors flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-surface-container p-2 rounded-lg">
                      <FolderOpen className="w-5 h-5 text-primary" />
                    </span>
                    <h3 className="font-semibold text-base text-on-surface">
                      Status Dokumen
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block bg-warning-container text-on-warning-container text-xs font-bold px-3 py-1 rounded-full">
                    {latestDocumentStatus.status}
                  </span>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {latestDocumentStatus.summary}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-primary group-hover:underline mt-4">
                Buka Halaman Dokumen &rarr;
              </span>
            </Link>
          </div>
        </div>

        {/* 4. Panel Pengumuman */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5">
            <div className="flex items-center gap-2 border-b border-outline-variant pb-4 mb-4">
              <Megaphone className="text-warning w-5 h-5 shrink-0" />
              <h2 className="font-semibold text-base text-primary">
                Pengumuman
              </h2>
            </div>
            <div className="space-y-4">
              <div className="group cursor-pointer hover:bg-surface-container-low p-2 -mx-2 rounded-lg transition-colors">
                <h4 className="text-sm font-semibold text-on-surface group-hover:text-secondary mb-1">
                  Pembaruan Jadwal Libur
                </h4>
                <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
                  Terdapat penyesuaian jadwal libur semester ganjil tahun ajaran
                  2024/2025. Harap periksa kembali kalender akademik.
                </p>
                <span className="text-[11px] text-outline flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 2 jam yang lalu
                </span>
              </div>
              <hr className="border-outline-variant/60" />
              <div className="group cursor-pointer hover:bg-surface-container-low p-2 -mx-2 rounded-lg transition-colors">
                <h4 className="text-sm font-semibold text-on-surface group-hover:text-secondary mb-1">
                  Batas Waktu Pengumpulan Dokumen
                </h4>
                <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
                  Bagi mahasiswa tingkat akhir, mohon segera melengkapi dokumen
                  persyaratan wisuda.
                </p>
                <span className="text-[11px] text-outline flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 1 hari yang lalu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}