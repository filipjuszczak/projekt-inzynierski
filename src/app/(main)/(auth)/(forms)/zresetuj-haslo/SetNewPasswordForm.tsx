"use client";

import { useState, useEffect, useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { setNewPassword } from "@/app/(main)/(auth)/(forms)/actions";
import {
  setNewPasswordSchema,
  SetNewPasswordValues
} from "@/lib/validation/set-new-password";

interface SetNewPasswordFormProps {
  token: string;
}

export default function SetNewPasswordForm({ token }: SetNewPasswordFormProps) {
  const [countdown, setCountdown] = useState(5);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (countdownStarted) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        router.push("/logowanie");
      }

      return () => clearInterval(timer);
    }
  }, [countdownStarted, countdown, router]);

  const form = useForm<SetNewPasswordValues>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmedPassword: ""
    }
  });

  async function onFormSubmit(values: SetNewPasswordValues) {
    if (values.password !== values.confirmedPassword) {
      form.setError("confirmedPassword", {
        type: "manual",
        message: "Hasła nie są takie same"
      });
      return;
    }

    startTransition(async () => {
      const result = await setNewPassword(token, values.password);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Hasło zostało zaktualizowane.");
        setCountdownStarted(true);
      } else {
        toast.error("Coś poszło nie tak. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <>
      {countdownStarted ? (
        <div>
          Hasło zostało zaktualizowane. Zostaniesz przekierowany na stronę
          logowania za {countdown} sekund.
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmedPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potwierdź hasło</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              isPending={isPending}
              idleText="Ustaw nowe hasło"
              loadingText="Wysyłanie..."
              className="w-full"
            />
          </form>
        </Form>
      )}
    </>
  );
}
