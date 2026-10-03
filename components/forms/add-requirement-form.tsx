"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addEnrollmentDocumentRequirement } from "@/actions/processor-portal.action";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AddRequirementFormProps {
    enrollmentId: string;
}

export function AddRequirementForm({ enrollmentId }: AddRequirementFormProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const res = await addEnrollmentDocumentRequirement(enrollmentId, {
            name,
            code: code.toUpperCase().replace(/\s+/g, '_'),
            description,
            isRequired: true
        });

        setIsLoading(false);

        if (res.success) {
            setOpen(false);
            setName("");
            setCode("");
            setDescription("");
            router.refresh();
        } else {
            setError(res.error || "Failed to add requirement");
        }
    };

    return (
        <>
            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => setOpen(true)}>
                + Add Additional Requirement
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Enrollment Requirement</DialogTitle>
                    <DialogDescription>
                        This will add a new document requirement specifically for this client's enrollment. It will not affect default program requirements.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Document Name</label>
                        <Input 
                            required 
                            placeholder="e.g. Employment Certificate"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setName(e.target.value);
                                // Auto-generate code if empty or matches previous auto-generation
                                if (!code || code === name.slice(0, -1).toUpperCase().replace(/\s+/g, '_')) {
                                    setCode(e.target.value.toUpperCase().replace(/\s+/g, '_'));
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Code</label>
                        <Input 
                            required 
                            placeholder="e.g. EMPLOYMENT_CERT"
                            value={code}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Textarea 
                            placeholder="Explain why this is required..."
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Add Requirement
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}
