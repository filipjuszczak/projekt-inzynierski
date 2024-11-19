"use client";

import { redirect } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logOut } from "@/app/(staff)/staff/actions";
import { useUserStore } from "@/hooks/use-user-store";

export default function LogOutButton() {
  const resetUserData = useUserStore(
    useShallow((state) => state.resetUserData)
  );

  const queryClient = useQueryClient();

  async function handleLogout() {
    const result = await logOut();
    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      queryClient.clear();
      resetUserData();
      toast.success("Wylogowano pomyślnie!");
      return redirect("/staff/login");
    } else {
      toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
    }
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut />
      <span>Wyloguj się</span>
    </DropdownMenuItem>
  );
}
