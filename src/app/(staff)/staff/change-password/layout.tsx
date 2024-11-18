import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/app/(staff)/staff/dashboard/DashboardSidebar";
import { authEmployee } from "@/app/(staff)/staff/auth";

export default async function Layout({ children }: React.PropsWithChildren) {
  const session = await authEmployee();
  if (!session.user) redirect("/staff/login");

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="w-full overflow-auto p-4">
        <SidebarTrigger className="md:hidden" />
        <main className="max-w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
