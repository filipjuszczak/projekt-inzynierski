import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/app/(staff)/staff/dashboard/DashboardSidebar";
import { authEmployee } from "@/app/(staff)/staff/auth";

export default async function Layout({ children }: React.PropsWithChildren) {
  const session = await authEmployee();
  if (!session.user) redirect("/staff/login");

  if ("mustChangePassword" in session && session.mustChangePassword) {
    redirect("/staff/dashboard/change-password");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex min-h-screen w-full flex-col overflow-auto p-4">
        <SidebarTrigger className="mb-10" />
        <main className="flex flex-grow flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
