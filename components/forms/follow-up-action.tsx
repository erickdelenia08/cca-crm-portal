"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { requestDocumentReupload } from "@/actions/processor-portal.action";
import { Loader2, Send } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface FollowUpActionProps {
    requirementId: string;
    requirementName: string;
    clientName: string;
}

export function FollowUpAction({ requirementId, requirementName, clientName }: FollowUpActionProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setError("Please provide a message for the client.");
            return;
        }

        setError(null);
        setIsLoading(true);

        const res = await requestDocumentReupload(requirementId, message);
        setIsLoading(false);

        if (res.success) {
            setOpen(false);
            setMessage("");
            router.refresh();
        } else {
            setError(res.error || "Failed to send follow up");
        }
    };

    return (
        <>
            <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => setOpen(true)}>
                <Send className="w-4 h-4 mr-2" /> Follow Up
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Follow Up with {clientName}</DialogTitle>
                    <DialogDescription>
                        Send a notification to request the missing or rejected document: <strong className="text-slate-900">{requirementName}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea 
                            required 
                            placeholder="Please upload this document as soon as possible..."
                            value={message}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Send Notification
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}
