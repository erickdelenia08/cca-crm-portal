import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/shared/app-layout";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  let hasCourse = false;
  let hasProgram = false;

  if (session.user.role === "CLIENT" && session.user.id) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        _count: {
          select: {
            clientEnrollments: true,
            courseEnrollments: true,
          },
        },
      },
    });

    if (user) {
      hasProgram = user._count.clientEnrollments > 0;
      hasCourse = user._count.courseEnrollments > 0;
    }
  }

  return (
    <AppLayout user={session.user} hasCourse={hasCourse} hasProgram={hasProgram}>

      {/* // <AppLayout> */}
      {children}
    </AppLayout>
  );
}
