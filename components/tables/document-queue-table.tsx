"use client";

import { ProcessorDocumentQueueItem } from "@/actions/processor-portal.action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, FileText, AlertCircle, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentQueueTableProps {
    queue: ProcessorDocumentQueueItem[];
    search?: string;
    status?: string;
}

export function DocumentQueueTable({ queue, search, status }: DocumentQueueTableProps) {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState<string>(search || "");
    const [statusValue, setStatusValue] = useState<string>(status || "ALL");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchValue) params.set("search", searchValue);
        if (statusValue && statusValue !== "ALL") params.set("status", statusValue);
        
        router.push(`/processor/documents?${params.toString()}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "MISSING":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Missing</Badge>;
            case "SUBMITTED":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending Review</Badge>;
            case "UNDER_REVIEW":
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Under Review</Badge>;
            case "REVISION_REQUIRED":
            case "REJECTED":
                return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Needs Re-upload</Badge>;
            case "APPROVED":
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex w-full sm:w-auto items-center gap-2">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input 
                            placeholder="Search client, requirement, ENR-..." 
                            className="pl-9"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                    </div>
                    <Select value={statusValue} onValueChange={(val) => {
                        const newStatus = val || "ALL";
                        setStatusValue(newStatus);
                        // Optional: auto trigger search on status change
                        const params = new URLSearchParams();
                        if (searchValue) params.set("search", searchValue);
                        if (newStatus && newStatus !== "ALL") params.set("status", newStatus);
                        router.push(`/processor/documents?${params.toString()}`);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="MISSING">Missing</SelectItem>
                            <SelectItem value="SUBMITTED">Pending Review</SelectItem>
                            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                            <SelectItem value="REVISION_REQUIRED">Needs Re-upload</SelectItem>
                            <SelectItem value="APPROVED">Verified</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSearch} variant="secondary">Filter</Button>
                </div>
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead>Client</TableHead>
                            <TableHead>Enrollment</TableHead>
                            <TableHead>Requirement</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queue.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                        <FileText className="w-8 h-8 text-slate-300 mb-2" />
                                        <p className="text-sm font-medium text-slate-900">Queue is Empty</p>
                                        <p className="text-sm">There are no documents or requirements requiring your attention.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            queue.map((item) => (
                                <TableRow key={item.id} className="group">
                                    <TableCell className="font-medium text-slate-900">
                                        {item.clientName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">{item.programName}</span>
                                            <span className="text-xs text-slate-500">{item.programTypeName} • ENR-{item.enrollmentId.substring(0, 8).toUpperCase()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-medium">
                                        {item.requirementName}
                                    </TableCell>
                                    <TableCell className="text-slate-500 whitespace-nowrap">
                                        {format(new Date(item.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(item.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.type === 'DOCUMENT' ? (
                                            <Link 
                                                href={`/processor/documents/${item.id}`}
                                                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity")}
                                            >
                                                Review <ArrowRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        ) : (
                                            <Link 
                                                href={`/processor/enrollments/${item.enrollmentId}`}
                                                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity")}
                                            >
                                                Follow Up <AlertCircle className="w-4 h-4 ml-1" />
                                            </Link>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
