"use client";

import { useTransition } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/hooks/use-user-store";
import { useShallow } from "zustand/react/shallow";
import { logOut } from "@/app/(main)/(auth)/(forms)/actions";

export default function AuthButtons() {
  const { email: isAuthenticated, resetUserData } = useUserStore(
    useShallow((state) => ({
      email: state.email,
      resetUserData: state.resetUserData
    }))
  );
  const [_, startTransition] = useTransition();
  const queryClient = useQueryClient();

  async function handleLogOut() {
    startTransition(async () => {
      const result = await logOut();

      if ("success" in result && result.success) {
        resetUserData();
        queryClient.clear();
        toast.success("Wylogowano pomyślnie.");
        return redirect("/logowanie");
      } else {
        toast.error("Wystąpił błąd podczas wylogowywania.");
      }
    });
  }

  return (
    <div className="hidden md:flex md:gap-2">
      {isAuthenticated ? (
        <Button onClick={handleLogOut}>Wyloguj się</Button>
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
