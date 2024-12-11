"use client";

import { useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { AtSign, EyeIcon, EyeOffIcon, KeyRound } from "lucide-react";
import { Role } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { logIn } from "@/app/actions";
import { useUserStore } from "@/hooks/use-user-store";
import { loginFormSchema, type Credentials } from "@/lib/validation/auth";

export default function LoginForm() {
  const setUserData = useUserStore(useShallow((state) => state.setUserData));
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
      const result = await logIn(Role.EMPLOYEE, credentials);

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
          dateOfBirth: result.userData.dateOfBirth,
          role: result.userData.role
        });
        toast.success("Zalogowano pomyślnie.");
        redirect("/panel-pracownika/pulpit");
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Panel pracownika</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
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
                        placeholder="jane@acme.com"
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
                        type={isPasswordVisible ? "text" : "password"}
                        id={field.name}
                        className="pl-8"
                        {...field}
                      />
                      {isPasswordVisible ? (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsPasswordVisible((i) => !i)}
                          className="absolute right-0 top-0"
                        >
                          <EyeOffIcon className="cursor-pointer" />
                          <span className="sr-only">Ukryj hasło</span>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsPasswordVisible((i) => !i)}
                          className="absolute right-0 top-0"
                        >
                          <EyeIcon className="cursor-pointer" />
                          <span className="sr-only">Pokaż hasło</span>
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
              idleText="Zaloguj się"
              loadingText="Logowanie..."
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
