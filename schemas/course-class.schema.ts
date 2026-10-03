import { z } from "zod";
import { CourseSessionMode } from "@prisma/client";

export const schedulePatternSchema = z.object({
    id: z.string().optional(),
    dayOfWeek: z.coerce.number().min(0).max(6), // 0: Sunday, 6: Saturday
    startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Invalid time format (HH:MM)"),
    defaultMode: z.nativeEnum(CourseSessionMode).optional(),
    defaultLocation: z.string().optional(),
});

export const courseClassSchema = z.object({
    id: z.string().optional(),
    courseId: z.string().min(1, "Course ID is required"),
    teacherId: z.string().min(1, "Teacher ID is required"),
    code: z.string().min(1, "Class code is required"),
    name: z.string().optional(),
    maxCapacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    // startDate: z.string().or(z.date()).transform((val) => new Date(val)),
    // endDate: z.string().or(z.date()).transform((val) => new Date(val)),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    isActive: z.boolean().optional(),
    // patterns: z.array(schedulePatternSchema).min(1, "At least one schedule pattern is required"),
    patterns: z.array(schedulePatternSchema),
});

export type SchedulePatternInput = z.infer<typeof schedulePatternSchema>;
export type CourseClassInput = z.infer<typeof courseClassSchema>;
