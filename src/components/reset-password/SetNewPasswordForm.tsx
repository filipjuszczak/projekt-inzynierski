"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  setNewPasswordSchema,
  SetNewPasswordValues
} from "@/lib/validation/set-new-password";
import { authClient } from "@/lib/auth/auth-client";
import { trackUserActivityClient } from "@/lib/auth/track-activity";
import { UserActivities } from "@prisma/client";

interface SetNewPasswordFormProps {
  token: string;
}

export default function SetNewPasswordForm({ token }: SetNewPasswordFormProps) {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<SetNewPasswordValues>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: ""
    }
  });

  const password = form.watch("password");
  const repeatPassword = form.watch("repeatPassword");

  const { isSubmitting } = form.formState;

  async function onFormSubmit(values: SetNewPasswordValues) {
    await authClient.resetPassword(
      {
        token,
        newPassword: values.password
      },
      {
        onSuccess: async () => {
          await trackUserActivityClient(UserActivities.PASSWORD_RESET);

          toast.success("Twoje hasło zostało pomyślnie zaktualizowane!");
          router.push("/logowanie");
        }
      }
    );
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
        <PasswordConditions
          password={password}
          repeatPassword={repeatPassword}
        />
        <LoadingButton
          isPending={isSubmitting}
          idleText="Ustaw nowe hasło"
          loadingText="Wysyłanie..."
          disabled={isSubmitting}
          className="w-full"
        />
      </form>
    </Form>
  );
}

interface PasswordConditionsProps {
  password: string;
  repeatPassword: string;
}

function PasswordConditions({
  password,
  repeatPassword
}: PasswordConditionsProps) {
  return (
    <div className="space-y-2 text-sm">
      <p>Hasło musi:</p>
      <ul className="list-inside list-disc space-y-1">
        <li
          className={password.length >= 8 ? "text-primary" : "text-destructive"}
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
          className={/\d/.test(password) ? "text-primary" : "text-destructive"}
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
            password === repeatPassword ? "text-primary" : "text-destructive"
          }
        >
          Hasła muszą być takie same
        </li>
      </ul>
    </div>
  );
}
