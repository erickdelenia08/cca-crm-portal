import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./columns"; // Create this file from columns-template.tsx
import { deleteItem } from "@/app/actions/your-action";
import { ItemForm } from "./item-form";

export const metadata: Metadata = {
  title: "Your Feature",
  description: "Manage your feature items here.",
};

export default async function FeaturePage() {
  const items = await prisma.yourModel.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Feature</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New</h3>
          <ItemForm />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Items</h3>
          <DataTable 
            columns={getColumns(deleteItem)} 
            data={items} 
            searchKey="title" 
          />
        </div>
      </div>
    </div>
  );
}
