import { getUsers } from "@/actions/user.action";
import { UserTable } from "@/components/tables/user-table";
import { Suspense } from "react";

export const metadata = {
    title: "User Management | CCA CRM",
    description: "Kelola pengguna dan hak akses portal",
};

export default async function UserManagementPage() {
    const users = await getUsers();

    return (
        <div className="p-6">
            <Suspense fallback={<div className="flex justify-center p-10"><span className="animate-pulse">Loading users...</span></div>}>
                <UserTable users={users} />
            </Suspense>
        </div>
    );
}