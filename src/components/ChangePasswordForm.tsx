"use client";

import { useState, useEffect, useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { Role } from "@prisma/client";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { changePassword } from "@/app/actions";
import { passwordsMatch } from "@/lib/utils";
import {
  changePasswordSchema,
  ChangePasswordValues
} from "@/lib/validation/employee";

interface ChangePasswordFormProps {
  userId: string;
  role: Role;
}

export default function ChangePasswordForm({
  userId,
  role
}: ChangePasswordFormProps) {
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [passwordConditionsMet, setPasswordConditionsMet] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: ""
    }
  });

  const oldPassword = form.watch("oldPassword");
  const newPassword = form.watch("newPassword");
  const repeatNewPassword = form.watch("repeatNewPassword");

  useEffect(() => {
    function checkPasswordConditions() {
      const minLength = newPassword.length >= 8;
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /\d/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      const passwordsMatch = newPassword === repeatNewPassword;

      return (
        !!oldPassword &&
        minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar &&
        passwordsMatch
      );
    }

    setPasswordConditionsMet(checkPasswordConditions());
  }, [oldPassword, newPassword, repeatNewPassword]);

  async function onFormSubmit(values: ChangePasswordValues) {
    if (!passwordsMatch(values.newPassword, values.repeatNewPassword)) {
      form.setError("repeatNewPassword", {
        type: "value",
        message: "Hasła nie są takie same"
      });
      return;
    }

    startTransition(async () => {
      const result = await changePassword(userId, role, values);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Hasło zostało zmienione!");

        if (role === Role.EMPLOYEE) {
          return redirect("/panel-pracownika/pulpit");
        } else {
          return redirect("/konto");
        }
      } else {
        toast.error(
          "Wystąpił błąd podczas zmiany hasła. Spróbuj ponownie później."
        );
      }
    });
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
                    <div className="relative">
                      <Input
                        type={isOldPasswordVisible ? "text" : "password"}
                        id={field.name}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setIsOldPasswordVisible((i) => !i)}
                      >
                        {isOldPasswordVisible ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {isOldPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
                        </span>
                      </Button>
                    </div>
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
                    <div className="relative">
                      <Input
                        type={isNewPasswordVisible ? "text" : "password"}
                        id={field.name}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setIsNewPasswordVisible((i) => !i)}
                      >
                        {isNewPasswordVisible ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {isNewPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
                        </span>
                      </Button>
                    </div>
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
                    <div className="relative">
                      <Input
                        type={isNewPasswordVisible ? "text" : "password"}
                        id={field.name}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setIsNewPasswordVisible((i) => !i)}
                      >
                        {isNewPasswordVisible ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {isNewPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2 text-sm">
              <p>Hasło musi:</p>
              <ul className="list-inside list-disc space-y-1">
                <li
                  className={
                    newPassword.length >= 8
                      ? "text-primary"
                      : "text-destructive"
                  }
                >
                  Mieć co najmniej 8 znaków
                </li>
                <li
                  className={
                    /[A-Z]/.test(newPassword)
                      ? "text-primary"
                      : "text-destructive"
                  }
                >
                  Zawierać co najmniej jedną wielką literę
                </li>
                <li
                  className={
                    /[a-z]/.test(newPassword)
                      ? "text-primary"
                      : "text-destructive"
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
            <LoadingButton
              isPending={isPending}
              idleText="Zapisz"
              loadingText="Wysyłanie..."
              disabled={!passwordConditionsMet}
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
