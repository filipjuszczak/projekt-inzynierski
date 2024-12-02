"use client";

import { redirect } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteAccount } from "@/app/(main)/konto/actions";
import { useUserStore } from "@/hooks/use-user-store";

interface DeleteAccountButtonProps {
  userId: string;
}

export default function DeleteAccountButton({
  userId
}: DeleteAccountButtonProps) {
  const queryClient = useQueryClient();
  const resetUserData = useUserStore(
    useShallow((state) => state.resetUserData)
  );

  async function handleDeleteAccount() {
    const deleteAccountResult = await deleteAccount(userId);

    if ("error" in deleteAccountResult) {
      toast.error(deleteAccountResult.error);
      return;
    }

    if ("success" in deleteAccountResult && deleteAccountResult.success) {
      resetUserData();
      queryClient.clear();
      toast.success("Pomyślnie usunięto Twoje konto. Trwa wylogowanie...");
      return redirect("/");
    } else {
      toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Usuń konto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Czy na pewno chcesz usunąć swoje konto?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tej czynności nie można cofnąć. Spowoduje to trwałe usunięcie
            Twojego konta i usunięcie Twoich danych z naszych serwerów.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            className={buttonVariants({ variant: "destructive" })}
          >
            Usuń konto
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
