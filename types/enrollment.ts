import { getConsultantsLookup, getProgramsLookup, getProgramTypesLookup, getStudentsLookup } from "@/actions/enrollment.action";
import { Prisma } from "@prisma/client";

// Export tipe data hasil return dari fungsi lookup masing-masing
export type StudentOption = Prisma.PromiseReturnType<typeof getStudentsLookup>[number];
export type ConsultantOption = Prisma.PromiseReturnType<typeof getConsultantsLookup>[number];
export type ProgramOption = Prisma.PromiseReturnType<typeof getProgramsLookup>[number];
export type ProgramTypeOption = Prisma.PromiseReturnType<typeof getProgramTypesLookup>[number];