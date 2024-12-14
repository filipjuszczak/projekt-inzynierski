"use client";

import { useState, useTransition } from "react";
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
import { requestPasswordReset } from "@/app/(main)/(auth)/(forms)/actions";
import {
  resetPasswordSchema,
  ResetPasswordValues
} from "@/lib/validation/reset-password";

interface ResetPasswordFormProps {
  onSuccess: () => void;
}

export default function ResetPasswordForm({
  onSuccess
}: ResetPasswordFormProps) {
  const [wasLinkSent, setWasLinkSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onFormSubmit(values: ResetPasswordValues) {
    startTransition(async () => {
      const result = await requestPasswordReset(values.email);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        setWasLinkSent(true);
        onSuccess();
        toast.success(
          "Wysłaliśmy link resetujący hasło na podany adres e-mail."
        );
      } else {
        toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres e-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          idleText="Zresetuj hasło"
          loadingText="Wysyłanie..."
          disabled={wasLinkSent}
          className="w-full"
        />
      </form>
    </Form>
  );
}
