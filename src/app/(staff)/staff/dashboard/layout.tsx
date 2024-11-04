import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/app/(staff)/staff/dashboard/DashboardSidebar";
import { authEmployee } from "@/app/(staff)/staff/auth";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await authEmployee();
  if (!session.user) redirect("/staff/login");

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
