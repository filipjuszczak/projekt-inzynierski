import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/app/(staff)/panel-pracownika/pulpit/DashboardSidebar";

export default function Layout({ children }: React.PropsWithChildren) {
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
