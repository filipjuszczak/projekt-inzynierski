"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserMenu from "@/components/UserMenu";
import { useCheckAuth } from "@/app/(main)/queries";

export default function AuthButtons() {
  const { setTheme, theme } = useTheme();
  const { data, isPending } = useCheckAuth();

  return (
    <div className="hidden md:flex md:gap-2">
      {data?.isAuthenticated ? (
        <UserMenu />
      ) : isPending ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
        <>
          {theme === "dark" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("system")}
            >
              <Monitor />
              <span className="sr-only">Zmień motyw na systemowy</span>
            </Button>
          ) : theme === "light" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("dark")}
            >
              <Moon />
              <span className="sr-only">Zmień motyw na ciemny</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("light")}
            >
              <Sun />
              <span className="sr-only">Zmień motyw na jasny</span>
            </Button>
          )}
          <Button asChild>
            <Link href="/logowanie">Zaloguj się</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/rejestracja">Zarejestruj się</Link>
          </Button>
        </>
      )}
    </div>
  );
}
