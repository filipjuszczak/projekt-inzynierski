"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { authClient } from "@/lib/auth/auth-client";
import {
  deleteAccountSchema,
  type DeleteAccountValues
} from "@/lib/validation/delete-account";
import PasswordInput from "../PasswordInput";

export default function DeleteAccountButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: ""
    }
  });

  const { isSubmitting } = form.formState;

  async function handleDeleteAccount(values: DeleteAccountValues) {
    await authClient.deleteUser(
      {
        password: values.password,
        callbackURL: "/konto-usuniete"
      },
      {
        onSuccess: () => {
          toast.success(
            "Sprawdź swoją skrzynkę e-mail, aby potwierdzić usunięcie konta."
          );

          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error("Wystąpił błąd podczas usunięcia konta.");
        }
      }
    );
  }

  return (
    <AlertDialog open={isDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          onClick={() => setIsDialogOpen(true)}
          className="w-full"
        >
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDeleteAccount)}>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Anuluj
              </AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting}
              >
                Usuń konto
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
