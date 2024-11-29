"use client";

import { redirect } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Role } from "@prisma/client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logOut } from "@/app/actions";
import { useUserStore } from "@/hooks/use-user-store";

interface LogoutButtonProps {
  redirectTo: string;
  asMenuItem?: boolean;
}

export default function LogoutButton({
  redirectTo,
  asMenuItem
}: LogoutButtonProps) {
  const resetUserData = useUserStore(
    useShallow((state) => state.resetUserData)
  );

  const queryClient = useQueryClient();

  async function handleLogout() {
    const result = await logOut(Role.NORMAL);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      queryClient.clear();
      resetUserData();
      toast.success("Wylogowano pomyślnie!");
      return redirect(redirectTo);
    } else {
      toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
    }
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
