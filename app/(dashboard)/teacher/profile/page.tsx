import { getTeacherProfile } from "@/actions/teacher-portal.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, Hash, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

export default async function TeacherProfilePage() {
    // In our teacher profile, the backend gets it from session
    // We can just use the existing `getTeacherProfile` if we export it, 
    // or fetch the current user via auth()
    
    // Actually, getTeacherProfile from teacher-portal.action.ts is exported
    const profile = await getTeacherProfile();

    if (!profile) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h2>
                <p className="text-slate-500 mt-2">Manage your teaching profile information.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="w-32 h-32 mb-4 border-4 border-white shadow-sm">
                            <AvatarImage src={profile.user.image || undefined} alt={profile.fullName} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-3xl font-bold">
                                {profile.fullName[0]}
                            </AvatarFallback>
                        </Avatar>
                        
                        <h3 className="text-2xl font-bold text-slate-900">{profile.fullName}</h3>
                        <p className="text-slate-500 mb-6">{profile.user.email}</p>
                        
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wide">
                            {profile.department || "TEACHING"}
                        </span>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Hash className="w-4 h-4" /> Employee ID
                                </label>
                                <p className="font-medium text-slate-900">{profile.employeeNumber || "Not assigned"}</p>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Full Name
                                </label>
                                <p className="font-medium text-slate-900">{profile.fullName}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email Address
                                </label>
                                <p className="font-medium text-slate-900">{profile.user.email}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Phone Number
                                </label>
                                <p className="font-medium text-slate-900">{profile.phone || "Not provided"}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Hire Date
                                </label>
                                <p className="font-medium text-slate-900">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Base Branch
                                </label>
                                <p className="font-medium text-slate-900">
                                    Headquarters
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                            <p className="text-sm text-slate-500 italic">
                                To update this information, please contact HR or Management.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
