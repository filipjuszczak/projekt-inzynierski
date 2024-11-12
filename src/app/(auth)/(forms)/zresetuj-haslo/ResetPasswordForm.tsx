"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
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
import { requestPasswordReset } from "@/app/(auth)/(forms)/actions";
import {
  resetPasswordSchema,
  ResetPasswordValues
} from "@/lib/validation/reset-password";

export default function ResetPasswordForm() {
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
        toast.success(
          "Wysłaliśmy link resetujący hasło na podany adres e-mail."
        );
      }
    });
  }

  return (
    <>
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
      {wasLinkSent && (
        <div className="flex items-center gap-2">
          <CircleCheck className="size-5" /> Link resetujący hasło został
          wysłany na podany adres e-mail.
        </div>
      )}
    </>
  );
}
