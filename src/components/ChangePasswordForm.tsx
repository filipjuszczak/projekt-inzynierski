"use client";

import { useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { EyeIcon, EyeOffIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { changePassword } from "@/app/(staff)/staff/change-password/actions";
import { useUserStore } from "@/hooks/use-user-store";
import {
  changePasswordSchema,
  ChangePasswordValues
} from "@/lib/validation/employee";
import { passwordsMatch } from "@/lib/utils";

export default function ChangePasswordForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const userEmail = useUserStore(useShallow((state) => state.email));

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      repeatNewPassword: ""
    }
  });

  async function onFormSubmit(values: ChangePasswordValues) {
    if (!passwordsMatch(values.newPassword, values.repeatNewPassword)) {
      form.setError("repeatNewPassword", {
        type: "value",
        message: "Hasła nie są takie same"
      });
      return;
    }

    startTransition(async () => {
      const result = await changePassword(userEmail, values);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Hasło zostało zmienione!");
        return redirect("/staff/dashboard");
      } else {
        toast.error(
          "Wystąpił błąd podczas zmiany hasła. Spróbuj ponownie później."
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Nowe hasło</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    id={field.name}
                    {...field}
                  />
                  {isPasswordVisible ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPasswordVisible((i) => !i)}
                    >
                      <EyeOffIcon className="cursor-pointer" />
                      <span className="sr-only">Pokaż hasło</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPasswordVisible((i) => !i)}
                    >
                      <EyeIcon
                        className="cursor-pointer"
                        onClick={() => setIsPasswordVisible((i) => !i)}
                      />
                      <span className="sr-only">Ukryj hasło</span>
                    </Button>
                  )}
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
              <FormLabel htmlFor={field.name}>Potwierdź nowe hasło</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type={isPasswordVisible ? "text" : "password"}
                    id={field.name}
                    {...field}
                  />
                  {isPasswordVisible ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPasswordVisible((i) => !i)}
                    >
                      <EyeOffIcon className="cursor-pointer" />
                      <span className="sr-only">Pokaż hasło</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPasswordVisible((i) => !i)}
                    >
                      <EyeIcon
                        className="cursor-pointer"
                        onClick={() => setIsPasswordVisible((i) => !i)}
                      />
                      <span className="sr-only">Ukryj hasło</span>
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          idleText="Zapisz"
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
