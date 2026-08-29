"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScheduleManagementPage() {
  const [activeTab, setActiveTab] = useState("settings");

  return (
    <div className="flex-1 flex flex-col pb-24">
      {/* Page Header */}
      <header className="mb-7">
        <h1 className="font-headline-md text-headline-md text-on-surface">Manajemen Jadwal & Booking</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Atur slot waktu ketersediaan Anda untuk sesi konsultasi mingguan. Pastikan jadwal selalu mutakhir untuk memudahkan siswa melakukan booking.
        </p>
      </header>

      {/* Tabs */}
      <div className="border-b border-outline-variant mb-6">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-label-md text-label-md transition-colors",
              activeTab === "settings"
                ? "border-secondary text-secondary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
            )}
          >
            Pengaturan Slot Ketersediaan
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-label-md text-label-md transition-colors",
              activeTab === "requests"
                ? "border-secondary text-secondary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
            )}
          >
            Permintaan Booking Siswa
          </button>
        </nav>
      </div>

      {activeTab === "settings" && (
        <>
          {/* Weekly Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Monday */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col h-full shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Senin</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">09:00 - 10:00</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">10:30 - 11:30</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">13:00 - 14:00</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button className="mt-4 w-full py-2 border-2 border-dashed border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Slot Range
              </button>
            </div>

            {/* Tuesday */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col h-full shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Selasa</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">09:00 - 10:00</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">14:00 - 15:00</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button className="mt-4 w-full py-2 border-2 border-dashed border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Slot Range
              </button>
            </div>

            {/* Wednesday */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col h-full shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">Rabu</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">Tidak Tersedia</p>
              </div>
              <button className="mt-4 w-full py-2 border-2 border-dashed border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low hover:text-primary transition-colors flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                <Plus className="w-4 h-4" /> Add Slot Range
              </button>
            </div>

            {/* Thursday */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col h-full shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Kamis</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">10:00 - 12:00</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button className="mt-4 w-full py-2 border-2 border-dashed border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Slot Range
              </button>
            </div>

            {/* Friday */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col h-full shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Jumat</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">09:00 - 10:00</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                  <span className="font-mono-sm text-mono-sm text-on-surface">15:00 - 16:30</span>
                  <button className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button className="mt-4 w-full py-2 border-2 border-dashed border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Slot Range
              </button>
            </div>
          </div>

          {/* Sticky Footer CTA */}
          <div className="fixed bottom-0 lg:left-64 right-0 bg-surface-container-lowest border-t border-outline-variant p-4 flex justify-end z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:bg-opacity-90 transition-all shadow-sm">
              Simpan Ketersediaan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
