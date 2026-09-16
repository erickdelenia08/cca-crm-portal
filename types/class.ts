export type ClassMode = "ONLINE" | "OFFLINE";
export type ScheduleCreator = "MANAGEMENT" | "TEACHER";

export interface BatchClassSession {
    id: string;
    className: string;
    program: string;
    sessionDate: string; // Misal: "2026-09-12"
    startTime: string;   // Misal: "10:00"
    endTime: string;     // Misal: "12:00"
    mode: ClassMode;
    locationOrLink: string; // Berisi URL Zoom/GMeet jika ONLINE, atau Nama Ruangan/Alamat jika OFFLINE
    createdBy: ScheduleCreator;
    totalStudents: number;
}