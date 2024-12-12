import Link from "next/link";
import { Film, Menu } from "lucide-react";
import { DrawerTrigger } from "@/components/ui/drawer";
import AuthButtons from "@/components/AuthButtons";

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex gap-2">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Film className="h-6 w-6" />
            <span className="inline-block font-bold">CinemaPlus</span>
          </Link>
          <div className="mr-4 hidden md:flex">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavLink href="/filmy?page=1">Filmy</NavLink>
              <NavLink href="/repertuar">Repertuar</NavLink>
            </nav>
          </div>
        </div>
        <AuthButtons />
        <DrawerTrigger asChild>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Przełącz menu</span>
          </button>
        </DrawerTrigger>
      </div>
    </header>
  );
}

interface HeaderLinkProps extends React.PropsWithChildren {
  href: string;
}

function NavLink({ href, children }: HeaderLinkProps) {
  return (
    <Link href={href} className="hover:underline">
      {children}
    </Link>
  );
}
