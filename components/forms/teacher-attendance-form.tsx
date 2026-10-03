"use client";

import { useState } from "react";
import { saveTeacherAttendance } from "@/actions/teacher-portal.action";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { TeacherStudentList, TeacherAttendanceRecords } from "@/actions/teacher-portal.action";

type Status = "ON_TIME" | "LATE" | "ABSENT" | "EXCUSED";

interface TeacherAttendanceFormProps {
    sessionId: string;
    classId: string;
    students: TeacherStudentList;
    initialAttendances: TeacherAttendanceRecords;
}

export function TeacherAttendanceForm({ sessionId, students, initialAttendances }: TeacherAttendanceFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Map initial state
    const [attendances, setAttendances] = useState<Record<string, Status>>(() => {
        const state: Record<string, Status> = {};
        students.forEach(student => {
            // Default to ON_TIME or find existing
            const existing = initialAttendances.find(a => a.clientId === student.clientId);
            state[student.clientId] = existing ? (existing.status as Status) : "ON_TIME";
        });
        return state;
    });

    const handleStatusChange = (clientId: string, status: Status) => {
        setAttendances(prev => ({ ...prev, [clientId]: status }));
        setIsSuccess(false);
    };

    const handleSave = async () => {
        setIsLoading(true);
        setIsSuccess(false);
        try {
            const data = Object.entries(attendances).map(([clientId, status]) => ({
                clientId,
                status
            }));
            const res = await saveTeacherAttendance(sessionId, data);
            if (res.success) {
                setIsSuccess(true);
                router.refresh();
            } else {
                alert(res.error);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan attendance");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {students.map(enrollment => {
                    const client = enrollment.client;
                    const status = attendances[enrollment.clientId];
                    
                    return (
                        <div key={enrollment.clientId} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-slate-200">
                                    <AvatarImage src={client.image || undefined} alt={client.name || "Student"} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                        {client.name?.[0] || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">{client.name}</p>
                                    <p className="text-xs text-slate-500">{client.email}</p>
                                </div>
                            </div>
                            
                            <div className="w-[140px]">
                                <Select value={status} onValueChange={(val: string | null) => { if(val) handleStatusChange(enrollment.clientId, val as Status) }}>
                                    <SelectTrigger className={`h-8 text-xs font-medium ${
                                        status === "ON_TIME" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                                        status === "LATE" ? "border-amber-200 bg-amber-50 text-amber-700" :
                                        status === "ABSENT" ? "border-red-200 bg-red-50 text-red-700" :
                                        "border-indigo-200 bg-indigo-50 text-indigo-700"
                                    }`}>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ON_TIME" className="text-emerald-700 font-medium">Present (On Time)</SelectItem>
                                        <SelectItem value="LATE" className="text-amber-700 font-medium">Present (Late)</SelectItem>
                                        <SelectItem value="EXCUSED" className="text-indigo-700 font-medium">Excused</SelectItem>
                                        <SelectItem value="ABSENT" className="text-red-700 font-medium">Absent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
                {isSuccess ? (
                    <span className="flex items-center text-sm font-medium text-emerald-600">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Saved successfully
                    </span>
                ) : (
                    <span className="text-sm text-slate-500">Unsaved changes will be lost</span>
                )}
                
                <Button 
                    onClick={handleSave} 
                    disabled={isLoading || students.length === 0} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Attendance
                </Button>
            </div>
        </div>
    );
}
