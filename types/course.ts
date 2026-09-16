export type CourseLevel = "BASIC" | "INTERMEDIATE" | "ADVANCED" | "PREPARATION";
export type CourseCategory = "LANGUAGE" | "ACADEMIC" | "SKILL" | "ORIENTATION";

export interface CourseItem {
    id: string;
    code: string;
    title: string;
    description?: string;
    category: CourseCategory;
    level: CourseLevel;
    durationHours: number; // Total Jam Pelajaran (JP)
    createdAt: string;
}