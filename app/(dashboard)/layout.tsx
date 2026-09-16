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

  if (session.user.role === "STUDENT" && session.user.id) {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            programEnrollments: true,
            courseEnrollments: true,
          }
        }
      }
    });

    if (student) {
      hasProgram = student._count.programEnrollments > 0;
      hasCourse = student._count.courseEnrollments > 0;
    }
  }

  return (
    <AppLayout user={session.user} hasCourse={hasCourse} hasProgram={hasProgram}>

      {/* // <AppLayout> */}
      {children}
    </AppLayout>
  );
}
