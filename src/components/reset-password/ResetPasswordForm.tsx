"use client";

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
import {
  resetPasswordSchema,
  ResetPasswordValues
} from "@/lib/validation/reset-password";
import { authClient } from "@/lib/auth/auth-client";

export default function ResetPasswordForm() {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const { isSubmitting, submitCount } = form.formState;

  async function onFormSubmit(values: ResetPasswordValues) {
    await authClient.requestPasswordReset(
      {
        email: values.email,
        redirectTo: "/zresetuj-haslo"
      },
      {
        onSuccess: () => {
          toast.success(
            "Wysłaliśmy link resetujący hasło na podany adres e-mail."
          );
        },
        onError: () => {
          toast.error("Wystąpił błąd podczas wysłania prośby o reset hasła.");
        }
      }
    );
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
          isPending={isSubmitting}
          idleText={submitCount > 0 ? "Link został wysłany" : "Zresetuj hasło"}
          loadingText="Wysyłanie..."
          disabled={submitCount > 0}
          className="w-full"
        />
      </form>
    </Form>
  );
}
