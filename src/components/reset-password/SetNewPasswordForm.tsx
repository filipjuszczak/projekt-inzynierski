"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { setNewPassword } from "@/app/(main)/(auth)/(forms)/actions";
import {
  setNewPasswordSchema,
  SetNewPasswordValues
} from "@/lib/validation/set-new-password";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";

interface SetNewPasswordFormProps {
  email: string;
  token: string;
  onSuccess: () => void;
}

export default function SetNewPasswordForm({
  email,
  token,
  onSuccess
}: SetNewPasswordFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordConditionsMet, setPasswordConditionsMet] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SetNewPasswordValues>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: ""
    }
  });

  const password = form.watch("password");
  const repeatPassword = form.watch("repeatPassword");

  useEffect(() => {
    function checkPasswordConditions() {
      const minLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const passwordsMatch = password === repeatPassword;

      return (
        minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar &&
        passwordsMatch
      );
    }

    setPasswordConditionsMet(checkPasswordConditions());
  }, [password, repeatPassword]);

  async function onFormSubmit(values: SetNewPasswordValues) {
    if (values.password !== values.repeatPassword) {
      form.setError("repeatPassword", {
        type: "value",
        message: "Hasła nie są takie same"
      });
      return;
    }

    startTransition(async () => {
      const result = await setNewPassword(email, token, values.password);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        onSuccess();
        toast.success("Hasło zostało zaktualizowane.");
      } else {
        toast.error(GENERIC_ERROR_MESSAGE);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    id={field.name}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setIsPasswordVisible((i) => !i)}
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="repeatPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potwierdź hasło</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    id={field.name}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setIsPasswordVisible((i) => !i)}
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isPasswordVisible ? "Ukryj hasło" : "Pokaż hasło"}
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
                password.length >= 8 ? "text-primary" : "text-destructive"
              }
            >
              Mieć co najmniej 8 znaków
            </li>
            <li
              className={
                /[A-Z]/.test(password) ? "text-primary" : "text-destructive"
              }
            >
              Zawierać co najmniej jedną wielką literę
            </li>
            <li
              className={
                /[a-z]/.test(password) ? "text-primary" : "text-destructive"
              }
            >
              Zawierać co najmniej jedną małą literę
            </li>
            <li
              className={
                /\d/.test(password) ? "text-primary" : "text-destructive"
              }
            >
              Zawierać co najmniej jedną cyfrę
            </li>
            <li
              className={
                /[!@#$%^&*(),.?":{}|<>]/.test(password)
                  ? "text-primary"
                  : "text-destructive"
              }
            >
              Zawierać co najmniej jeden znak specjalny
            </li>
            <li
              className={
                password === repeatPassword
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
          idleText="Ustaw nowe hasło"
          loadingText="Wysyłanie..."
          disabled={!passwordConditionsMet}
          className="w-full"
        />
      </form>
    </Form>
  );
}
