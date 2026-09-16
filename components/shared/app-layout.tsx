import { ReactNode } from "react";
import { Navigation } from "../navigation";
// import { Navbar } from "./navbar";
import { AppBar } from "./appbar";

interface AppLayoutProps {
  children: ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  hasCourse?: boolean;
  hasProgram?: boolean;
}

export function AppLayout({ children, user, hasCourse, hasProgram }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation role={user?.role} hasCourse={hasCourse} hasProgram={hasProgram} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* <Navbar user={user} /> */}
        <AppBar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
