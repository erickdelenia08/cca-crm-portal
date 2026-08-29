import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/shared/app-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  //   if (!session?.user) {
  //   redirect("/login");
  // }

  return (
    // <AppLayout user={session.user}>

    <AppLayout>
      {children}
    </AppLayout>
  );
}
