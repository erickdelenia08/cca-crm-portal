"use client";

import React, { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createFullEnrollment, getCoursesLookup, getCourseClassesLookup } from "@/actions/enrollment.action";

type LookupItem = { id: string; name?: string; email?: string; code?: string; title?: string; [key: string]: unknown };
type ProgramTypeItem = LookupItem & { deliveryType: "SERVICE" | "COURSE" };

export function EnrollmentStepper({
    clients,
    consultants,
    programs,
    programTypes,
}: {
    clients: LookupItem[];
    consultants: LookupItem[];
    programs: LookupItem[];
    programTypes: ProgramTypeItem[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form State
    const [clientId, setClientId] = useState("");
    const [programId, setProgramId] = useState("");
    const [programTypeId, setProgramTypeId] = useState("");
    
    // Delivery Type specific
    const selectedType = programTypes.find(t => t.id === programTypeId);
    const deliveryType = selectedType?.deliveryType;
    const isCourse = deliveryType === "COURSE";
    const isService = deliveryType === "SERVICE";

    const [consultantId, setConsultantId] = useState("");
    const [courses, setCourses] = useState<LookupItem[]>([]);
    const [courseId, setCourseId] = useState("");
    const [classes, setClasses] = useState<LookupItem[]>([]);
    const [courseClassId, setCourseClassId] = useState("");

    // Load courses if COURSE delivery type
    useEffect(() => {
        if (isCourse && programTypeId) {
            getCoursesLookup(programTypeId).then(res => {
                setCourses(res);
                setCourseId("");
                setCourseClassId("");
            });
        }
    }, [isCourse, programTypeId]);

    // Load classes if Course selected
    useEffect(() => {
        if (isCourse && courseId) {
            getCourseClassesLookup(courseId).then(res => {
                setClasses(res);
                setCourseClassId("");
            });
        }
    }, [isCourse, courseId]);

    const filteredProgramTypes = useMemo(
        () => programTypes.filter(pt => pt.programId === programId),
        [programTypes, programId]
    );

    const selectedCourseClass = useMemo(
        () => classes.find(c => c.id === courseClassId),
        [classes, courseClassId]
    );

    const canProceedToNext = () => {
        if (step === 1) return !!clientId;
        if (step === 2) return !!programId;
        if (step === 3) return !!programTypeId;
        if (step === 4) {
            if (isService) return true; // Consultant is optional by default
            if (isCourse) return !!courseClassId;
        }
        return true;
    };

    const nextStep = () => {
        if (canProceedToNext()) {
            setStep(s => Math.min(5, s + 1));
        }
    };
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = async () => {
        if (!canProceedToNext()) return;
        setMessage(null);
        startTransition(async () => {
            try {
                const programData = {
                    clientId,
                    programTypeId,
                    consultantId: isService ? consultantId || null : null,
                    status: "ONBOARDING" as any,
                    notes: "Created via Wizard",
                };

                const courseData = isCourse ? {
                    courseClassId,
                    status: "ACTIVE" as any,
                    notes: "Created via Wizard"
                } : undefined;

                const res = await createFullEnrollment({ programData, courseData });
                setMessage({ type: "success", text: "Enrollment created successfully!" });
                setTimeout(() => {
                    router.push(`/management/enrollments/${res.id}`);
                }, 1000);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                setMessage({ type: "error", text: errorMessage });
            }
        });
    };

    const formatCapacity = (cls: any) => {
        const available = cls.maxCapacity - (cls.currentEnrolled || 0);
        return {
            available,
            text: `Capacity: ${cls.maxCapacity} | Enrolled: ${cls.currentEnrolled || 0} | Available: ${available}`
        };
    };

    return (
        <div className="space-y-6 text-sm bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {/* Steps indicator */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                {["Client", "Program", "Type", "Details", "Summary"].map((label, i) => {
                    const stepNum = i + 1;
                    return (
                        <div key={stepNum} className={`flex-1 text-center font-bold pb-2 ${step === stepNum ? "text-blue-600 border-b-2 border-blue-600" : (step > stepNum ? "text-green-500 border-b-2 border-green-500" : "text-slate-400 border-b-2 border-slate-100")}`}>
                            {stepNum}. {label}
                        </div>
                    );
                })}
            </div>

            {message && (
                <div className={`p-4 rounded-md border font-medium text-sm ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* STEP 1: Select Client */}
            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-lg font-bold text-slate-900">Step 1: Select Client</h2>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client *</label>
                        <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required>
                            <option value="" disabled>-- Select Client --</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : ''}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* STEP 2: Select Program */}
            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-lg font-bold text-slate-900">Step 2: Select Program</h2>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Program *</label>
                        <select value={programId} onChange={e => {
                            setProgramId(e.target.value);
                            setProgramTypeId("");
                        }} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required>
                            <option value="" disabled>-- Select Program --</option>
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* STEP 3: Select Program Type */}
            {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-lg font-bold text-slate-900">Step 3: Select Program Type</h2>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Program Type *</label>
                        <select value={programTypeId} onChange={e => setProgramTypeId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required>
                            <option value="" disabled>-- Select Program Type --</option>
                            {filteredProgramTypes.map(pt => (
                                <option key={pt.id} value={pt.id}>{pt.name} ({pt.deliveryType})</option>
                            ))}
                        </select>
                    </div>
                    {deliveryType && (
                        <div className="p-4 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg">
                            <p className="text-xs font-bold uppercase mb-1">Delivery Type</p>
                            <p className="font-semibold text-lg">{deliveryType}</p>
                            <p className="text-sm mt-1">
                                {isCourse ? "This is a COURSE. You will need to select a Course and a Class in the next step." : "This is a SERVICE. You can optionally assign a Consultant/PIC in the next step."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 4: Delivery Type Specific Details */}
            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-lg font-bold text-slate-900">Step 4: Details</h2>
                    
                    {isService && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Consultant / PIC (Optional)</label>
                                <select value={consultantId} onChange={e => setConsultantId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                                    <option value="">-- No Consultant --</option>
                                    {consultants.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {isCourse && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course *</label>
                                <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required>
                                    <option value="" disabled>-- Select Course --</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            
                            {courseId && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Class / Batch *</label>
                                    <select value={courseClassId} onChange={e => setCourseClassId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required>
                                        <option value="" disabled>-- Select Class --</option>
                                        {classes.map(c => {
                                            const cap = formatCapacity(c);
                                            return (
                                                <option key={c.id} value={c.id} disabled={cap.available <= 0}>
                                                    {c.name} {cap.available <= 0 ? "(FULL)" : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    
                                    {selectedCourseClass && (
                                        <div className={`mt-3 p-4 rounded-lg border ${formatCapacity(selectedCourseClass).available > 0 ? "bg-slate-50 border-slate-200" : "bg-red-50 border-red-200"}`}>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="text-slate-500 font-bold block mb-1">Teacher</span>
                                                    <span className="text-slate-900 font-medium">{String(selectedCourseClass.teacherName || "-")}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-bold block mb-1">Schedule</span>
                                                    <span className="text-slate-900 font-medium">{String(selectedCourseClass.schedule || "-")}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-bold block mb-1">Start Date</span>
                                                    <span className="text-slate-900 font-medium">{selectedCourseClass.startDate ? new Date(selectedCourseClass.startDate as Date).toLocaleDateString() : "-"}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 font-bold block mb-1">Capacity</span>
                                                    <span className={`${formatCapacity(selectedCourseClass).available > 0 ? "text-slate-900" : "text-red-700 font-bold"}`}>
                                                        {formatCapacity(selectedCourseClass).text}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 5: Summary */}
            {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-lg font-bold text-slate-900">Step 5: Review & Confirm</h2>
                    
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">Client</span>
                                <span className="font-semibold text-slate-900">{clients.find(c => c.id === clientId)?.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">Program</span>
                                <span className="font-semibold text-slate-900">{programs.find(p => p.id === programId)?.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">Program Type</span>
                                <span className="font-semibold text-slate-900">{selectedType?.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">Delivery Type</span>
                                <span className="font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-xs">{deliveryType}</span>
                            </div>

                            {isService && (
                                <div>
                                    <span className="block text-xs font-bold text-slate-500 uppercase">Consultant / PIC</span>
                                    <span className="font-semibold text-slate-900">{consultantId ? consultants.find(c => c.id === consultantId)?.name : "Not Assigned"}</span>
                                </div>
                            )}

                            {isCourse && selectedCourseClass && (
                                <>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-500 uppercase">Course</span>
                                        <span className="font-semibold text-slate-900">{courses.find(c => c.id === courseId)?.name}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-500 uppercase">Class</span>
                                        <span className="font-semibold text-slate-900">{selectedCourseClass.name}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1 || isPending}
                    className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                    Back
                </button>
                
                {step < 5 ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={!canProceedToNext() || isPending}
                        className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-300 transition-colors shadow-sm"
                    >
                        Next Step
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                        {isPending ? "Creating..." : "Confirm & Create Enrollment"}
                    </button>
                )}
            </div>
        </div>
    );
}
