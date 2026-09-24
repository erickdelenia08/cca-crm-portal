import Link from "next/link";
import { getPrograms } from "@/actions/program.action";
import { Layers } from "lucide-react";

export default async function ProgramsPage() {
    const programs = await getPrograms();

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Business Lines (Programs)</h1>
                    <p className="text-sm text-gray-500">Kelola kelompok bisnis dan unit operasional.</p>
                </div>
                <Link
                    href="/management/programs/create"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-all"
                >
                    + Create Program
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {programs.map((prog) => (
                    <Link
                        key={prog.id}
                        href={`/management/programs/${prog.id}`}
                        className="block p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Layers className="w-5 h-5" />
                            </div>
                            {!prog.isActive && (
                                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200 font-bold">INACTIVE</span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{prog.name}</h2>
                        <div className="text-[10px] font-mono text-gray-400 mb-1">{prog.code}</div>
                        <p className="text-xs text-gray-500 mt-1 h-10 line-clamp-2">{prog.description}</p>
                        
                        <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs font-semibold text-blue-600">
                            <span>{prog.programTypeCount} Services / Courses</span>
                            <span>Manage →</span>
                        </div>
                    </Link>
                ))}
                
                {programs.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                        Belum ada Business Line (Program) yang dibuat.
                    </div>
                )}
            </div>
        </div>
    );
}