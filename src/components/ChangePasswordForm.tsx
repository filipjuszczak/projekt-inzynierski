"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import LoadingButton from "@/components/LoadingButton";
import { authClient } from "@/lib/auth/auth-client";
import {
  changePasswordSchema,
  ChangePasswordValues
} from "@/lib/validation/employee";
import PasswordInput from "./PasswordInput";
import { trackUserActivityClient } from "@/lib/auth/track-activity";
import { UserActivities } from "@prisma/client";

export default function ChangePasswordForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: ""
    }
  });

  const newPassword = form.watch("newPassword");
  const repeatNewPassword = form.watch("repeatNewPassword");

  const { isSubmitting } = form.formState;

  async function onFormSubmit(values: ChangePasswordValues) {
    await authClient.changePassword(
      {
        currentPassword: values.oldPassword,
        newPassword: values.newPassword
      },
      {
        onSuccess: async () => {
          await trackUserActivityClient(UserActivities.PASSWORD_CHANGED);

          toast.success("Hasło zostało zmienione!");
          const path = !["EMPLOYEE", "ADMIN"].includes(session?.user.role || "")
            ? "/konto"
            : "/panel-pracownika/pulpit";
          router.push(path);
        },
        onError: () => {
          toast.error(
            "Wystąpił błąd podczas zmiany hasła. Spróbuj ponownie później."
          );
        }
      }
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">Zmień hasło</CardTitle>
        <CardDescription>
          Wprowadź swoje aktualne hasło, a następnie nowe hasło, które chcesz
          ustawić.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
            <FormField
              name="oldPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Stare hasło</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Nowe hasło</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="repeatNewPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>
                    Potwierdź nowe hasło
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordConditions
              newPassword={newPassword}
              repeatNewPassword={repeatNewPassword}
            />
            <LoadingButton
              isPending={isSubmitting}
              idleText="Zapisz"
              loadingText="Wysyłanie..."
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface PasswordConditionsProps {
  newPassword: string;
  repeatNewPassword: string;
}

function PasswordConditions({
  newPassword,
  repeatNewPassword
}: PasswordConditionsProps) {
  return (
    <div className="space-y-2 text-sm">
      <p>Hasło musi:</p>
      <ul className="list-inside list-disc space-y-1">
        <li
          className={
            newPassword.length >= 8 ? "text-primary" : "text-destructive"
          }
        >
          Mieć co najmniej 8 znaków
        </li>
        <li
          className={
            /[A-Z]/.test(newPassword) ? "text-primary" : "text-destructive"
          }
        >
          Zawierać co najmniej jedną wielką literę
        </li>
        <li
          className={
            /[a-z]/.test(newPassword) ? "text-primary" : "text-destructive"
          }
        >
          Zawierać co najmniej jedną małą literę
        </li>
        <li
          className={
            /\d/.test(newPassword) ? "text-primary" : "text-destructive"
          }
        >
          Zawierać co najmniej jedną cyfrę
        </li>
        <li
          className={
            /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
              ? "text-primary"
              : "text-destructive"
          }
        >
          Zawierać co najmniej jeden znak specjalny
        </li>
        <li
          className={
            newPassword === repeatNewPassword
              ? "text-primary"
              : "text-destructive"
          }
        >
          Hasła muszą być takie same
        </li>
      </ul>
    </div>
  );
}
