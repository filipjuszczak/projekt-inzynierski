"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { AtSign, KeyRound } from "lucide-react";
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
import { loginFormSchema, type Credentials } from "@/lib/validation/auth";
import { logIn } from "@/app/(auth)/auth/actions";
import { redirect } from "next/navigation";
import { useUserStore } from "@/hooks/use-user-store";

export default function LoginForm() {
  const setUserData = useUserStore(useShallow((state) => state.setUserData));
  const [isPending, startTransition] = useTransition();

  const form = useForm<Credentials>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      login: "",
      password: ""
    }
  });

  async function onFormSubmit(credentials: Credentials) {
    startTransition(async () => {
      const result = await logIn(credentials);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        setUserData({
          firstName: result.userData.firstName,
          lastName: result.userData.lastName,
          username: result.userData.username,
          email: result.userData.email,
          userType: result.userData.userType
        });
        toast.success("Zalogowano pomyślnie!");
        return redirect("/");
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="login"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>
                Nazwa użytkownika lub adres e-mail
              </FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <AtSign className="pointer-events-none absolute left-2 top-2 size-5 text-muted-foreground" />
                  <Input
                    id={field.name}
                    placeholder="jkowalski / jan.kowalski@email.com"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Hasło</FormLabel>
              <FormControl>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-2 top-2 size-5 text-muted-foreground" />
                  <Input
                    type="password"
                    id={field.name}
                    placeholder="********"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          idleText="Zaloguj się"
          loadingText="Logowanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
