export type ProgramStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ProgramItem {
    id: string;
    code: string;
    title: string;
    description?: string;
    price: number;
    status: ProgramStatus;
    coursesCount?: number;
    activeStudentsCount?: number;
    createdAt: string;
}