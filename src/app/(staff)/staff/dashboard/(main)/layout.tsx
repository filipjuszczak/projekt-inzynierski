import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/app/(staff)/staff/dashboard/(main)/DashboardSidebar";
import { authEmployee } from "@/app/(staff)/staff/auth";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await authEmployee();

  if (!session.user) redirect("/staff/login");

  if ("mustChangePassword" in session && session.mustChangePassword) {
    redirect("/staff/dashboard/change-password");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
