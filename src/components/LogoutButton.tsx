"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

interface LogoutButtonProps {
  redirectTo: string;
  asMenuItem?: boolean;
}

export default function LogoutButton({
  redirectTo,
  asMenuItem
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    authClient.signOut(undefined, {
      onSuccess: () => {
        toast.success("Wylogowano pomyślnie!");
        router.push(redirectTo);
      },
      onError: () => {
        toast.error("Wystąpił błąd podczas wylogowania.");
      }
    });
  }

  if (asMenuItem) {
    return (
      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
        <LogOut />
        <span>Wyloguj się</span>
      </DropdownMenuItem>
    );
  } else {
    return (
      <li
        onClick={handleLogout}
        className="flex cursor-pointer items-center gap-2 py-2"
      >
        <LogOut className="size-4" />
        <span>Wyloguj się</span>
      </li>
    );
  }
}
