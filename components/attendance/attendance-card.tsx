"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { tapIn, getTodayAttendance } from "@/actions/hr.action";
import { useRouter } from "next/navigation";

export function AttendanceCard() {
    const [attendance, setAttendance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tappingIn, setTappingIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        setLoading(true);
        const res = await getTodayAttendance();
        if (res.success) {
            setAttendance(res.data);
        }
        setLoading(false);
    };

    const handleTapIn = async () => {
        setTappingIn(true);
        const res = await tapIn();
        if (res.success) {
            setAttendance(res.attendance);
            router.refresh();
        } else {
            alert(res.error || "Gagal melakukan presensi.");
        }
        setTappingIn(false);
    };

    const todayDate = new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date());

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-xl border border-slate-200 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Presensi</h2>
            <p className="text-sm font-semibold text-slate-800 mb-4">{todayDate}</p>

            {attendance ? (
                <div className="space-y-2">
                    <div className="inline-flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-bold">Sudah Presensi</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        Check In: {new Intl.DateTimeFormat("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZoneName: "short"
                        }).format(new Date(attendance.checkIn))}
                    </p>
                </div>
            ) : (
                <div className="space-y-3 w-full">
                    <p className="text-xs text-slate-500">Belum melakukan presensi</p>
                    <button
                        onClick={handleTapIn}
                        disabled={tappingIn}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Clock className="w-5 h-5" />
                        {tappingIn ? "Merekam..." : "TAP IN"}
                    </button>
                </div>
            )}
        </div>
    );
}
