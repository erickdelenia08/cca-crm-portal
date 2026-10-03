"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { verifyDocument, rejectDocument } from "@/actions/processor-portal.action";
import { Loader2, Check, X } from "lucide-react";

interface DocumentReviewFormProps {
    documentId: string;
    currentStatus: string;
}

export function DocumentReviewForm({ documentId, currentStatus }: DocumentReviewFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const router = useRouter();

    const handleVerify = async () => {
        setError(null);
        setIsLoading(true);

        const res = await verifyDocument(documentId, note);
        setIsLoading(false);

        if (res.success) {
            router.refresh();
        } else {
            setError(res.error || "Failed to verify document");
        }
    };

    const handleReject = async () => {
        if (!note.trim()) {
            setError("A reason is required when rejecting a document.");
            return;
        }

        setError(null);
        setIsLoading(true);

        const res = await rejectDocument(documentId, note);
        setIsLoading(false);

        if (res.success) {
            router.refresh();
        } else {
            setError(res.error || "Failed to reject document");
        }
    };

    const isProcessed = currentStatus === "APPROVED" || currentStatus === "REJECTED" || currentStatus === "REVISION_REQUIRED";

    return (
        <div className="space-y-4 bg-white p-5 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-900">Review Actions</h3>
            
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    Review Note / Rejection Reason
                </label>
                <Textarea 
                    placeholder="Enter notes for internal tracking, or the reason for rejection..."
                    value={note}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                    disabled={isProcessed || isLoading}
                    rows={4}
                />
            </div>

            {!isProcessed && (
                <div className="flex gap-3 pt-2">
                    <Button 
                        onClick={handleVerify} 
                        disabled={isLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                        Verify Document
                    </Button>
                    <Button 
                        onClick={handleReject} 
                        disabled={isLoading}
                        variant="outline"
                        className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                        Reject / Request Re-upload
                    </Button>
                </div>
            )}
            
            {isProcessed && (
                <div className="p-3 bg-slate-50 text-slate-600 text-sm rounded-md text-center">
                    This document has already been processed.
                </div>
            )}
        </div>
    );
}
