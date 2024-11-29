import Link from "next/link";
import { Film, Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AuthButtons from "@/components/AuthButtons";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Drawer>
      <div className="container mx-auto flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between px-4">
            <div className="flex gap-2">
              <Link className="mr-6 flex items-center space-x-2" href="/">
                <Film className="h-6 w-6" />
                <span className="inline-block font-bold">CinemaPlus</span>
              </Link>
              <div className="mr-4 hidden md:flex">
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link href="/filmy">Movies</Link>
                  <Link href="/cinemas">Cinemas</Link>
                  <Link href="/offers">Offers</Link>
                </nav>
              </div>
            </div>
            <AuthButtons />
            <DrawerTrigger asChild>
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </DrawerTrigger>
          </div>
        </header>
        {children}
        <footer className="w-full border-t bg-background py-6">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">About Us</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/about" className="text-sm hover:underline">
                      Our Story
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-sm hover:underline">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Help</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/faq" className="text-sm hover:underline">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm hover:underline">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Legal</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/terms" className="text-sm hover:underline">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Newsletter</h3>
                <form className="flex space-x-2">
                  <Input type="email" placeholder="Enter your email" />
                  <Button type="submit">Subscribe</Button>
                </form>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} CinemaPlus. Wszelkie prawa
              zastrzeżone.
            </div>
          </div>
        </footer>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="sr-only">Menu nawigacyjne</DrawerTitle>
          <DrawerDescription className="sr-only">
            Menu nawigacyjne
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 p-4">
          <nav>
            <ul className="space-y-4">
              <li>
                <Link href="/">Strona główna</Link>
              </li>
              <li>
                <Link href="/filmy">Filmy</Link>
              </li>
              <li>
                <Link href="/repertuar">Repertuar</Link>
              </li>
            </ul>
          </nav>
          <Separator />
          <Button asChild>
            <Link href="/logowanie" className="w-full">
              Zaloguj się
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/rejestracja" className="w-full">
              Zarejestruj się
            </Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
