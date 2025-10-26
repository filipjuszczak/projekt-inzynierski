"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AtSign, EyeIcon, EyeOffIcon, KeyRound } from "lucide-react";
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
import { loginFormSchema, type Credentials } from "@/lib/validation/auth";
import { authClient } from "@/lib/auth/auth-client";

export default function LoginForm() {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<Credentials>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { isSubmitting } = form.formState;

  async function onFormSubmit(credentials: Credentials) {
    await authClient.signIn.email(
      {
        email: credentials.email,
        password: credentials.password,
        callbackURL: "/"
      },
      {
        onSuccess: () => {
          toast.success("Logowanie pomyślne!");
          router.push("/");
        },
        onError: (error) => {
          let message = "Wystąpił błąd podczas logowania.";
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            message = "Potwierdź swój adres e-mail, zanim się zalogujesz.";
          }

          toast.error(message);
        }
      }
    );
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-center text-3xl">Zaloguj się</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Adres e-mail</FormLabel>
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
                          <span className="sr-only">Hide password</span>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setIsPasswordVisible((i) => !i)}
                          className="absolute right-0 top-0"
                        >
                          <EyeIcon className="cursor-pointer text-muted-foreground" />
                          <span className="sr-only">Show password</span>
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Link href="/zresetuj-haslo" className="text-sm">
                Nie pamiętasz hasła?
              </Link>
            </div>
            <LoadingButton
              isPending={isSubmitting}
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
