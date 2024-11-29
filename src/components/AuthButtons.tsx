"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserMenu from "@/components/UserMenu";
import { useCheckAuth } from "@/app/(main)/queries";

export default function AuthButtons() {
  const { data, isPending } = useCheckAuth();

  return (
    <div className="hidden md:flex md:gap-2">
      {data?.isAuthenticated ? (
        <UserMenu />
      ) : isPending ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : (
        <>
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
