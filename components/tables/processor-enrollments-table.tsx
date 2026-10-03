"use client";

import { ProcessorEnrollment } from "@/actions/processor-portal.action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, Briefcase } from "lucide-react";

interface ProcessorEnrollmentsTableProps {
    enrollments: ProcessorEnrollment[];
}

export function ProcessorEnrollmentsTable({ enrollments }: ProcessorEnrollmentsTableProps) {
    if (enrollments.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg bg-slate-50">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-slate-900">No Service Enrollments</h3>
                <p className="text-sm text-slate-500 mt-1">There are no service enrollments available for processing.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead>Client</TableHead>
                        <TableHead>Program Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Consultant</TableHead>
                        <TableHead className="text-center">Documents</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id} className="group">
                            <TableCell className="font-medium text-slate-900">
                                {enrollment.client.clientProfile?.fullName || enrollment.client.name || 'Unknown'}
                            </TableCell>
                            <TableCell className="text-slate-600">
                                {enrollment.programType.name}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                    {enrollment.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-slate-500">
                                {enrollment.consultant?.consultantProfile?.fullName || enrollment.consultant?.name || '-'}
                            </TableCell>
                            <TableCell className="text-center text-slate-500 text-sm">
                                {enrollment._count.documents} / {enrollment._count.documentRequirements}
                            </TableCell>
                            <TableCell className="text-right">
                                <Link 
                                    href={`/processor/enrollments/${enrollment.id}`}
                                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-blue-600")}
                                >
                                    Manage <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
