"use client";

import Link from "next/link";
import { BookOpen, User } from "lucide-react";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/LogoutButton";
import { authClient } from "@/lib/auth/auth-client";

export default function MobileDrawerContent() {
  const { data: session, isPending } = authClient.useSession();

  return (
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
        {session?.session.token ? (
          <div>
            <nav>
              <ul>
                <li>
                  <Link
                    href="/konto"
                    className="flex w-full items-center gap-2 py-2"
                  >
                    <User className="size-4" />
                    <span>Moje konto</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/konto/rezerwacje"
                    className="flex w-full items-center gap-2 py-2"
                  >
                    <BookOpen className="size-4" />
                    <span>Moje rezerwacje</span>
                  </Link>
                </li>
                <LogoutButton redirectTo="/logowanie" />
              </ul>
            </nav>
          </div>
        ) : isPending ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </DrawerContent>
  );
}
