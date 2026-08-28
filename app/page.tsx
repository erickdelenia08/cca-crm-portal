// src/app/page.tsx
import { prisma } from '@/lib/prisma';

export default async function Home() {
  // Mencoba query ke MySQL via Prisma Adapter
  const users = await prisma.user.findMany();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">CRM Student Portal</h1>
      <div className="bg-green-100 text-green-800 p-4 rounded-md">
        Status Database: <strong>Terhubung Ke MySQL via Prisma Adapter!</strong>
      </div>
      <p className="mt-4">Total User Terdaftar: {users.length}</p>
    </main>
  );
}