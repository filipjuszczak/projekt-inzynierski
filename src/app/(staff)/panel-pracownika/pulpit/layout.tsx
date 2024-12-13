import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getMovieList } from "@/app/(staff)/panel-pracownika/pulpit/data";

export default async function Layout({ children }: React.PropsWithChildren) {
  const movies = await getMovieList();

  return (
    <SidebarProvider>
      <DashboardSidebar movies={movies} />
      <div className="flex min-h-screen w-full flex-col overflow-auto p-4">
        <SidebarTrigger className="mb-10" />
        <main className="flex flex-grow flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
