import { getTeacherClass } from "@/actions/teacher-portal.action";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, FileText, Download } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function TeacherClassMaterialsPage({
    params
}: {
    params: { classId: string }
}) {
    // Assuming you have a getTeacherMaterials or use getTeacherClass
    const { success, data: courseClass } = await getTeacherClass(params.classId);

    if (!success || !courseClass) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Teaching Materials</h3>
                <Button disabled size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Upload Material
                </Button>
            </div>

            <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-slate-500">
                    <Folder className="w-12 h-12 mb-4 opacity-20" />
                    <p>Material management feature is coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
