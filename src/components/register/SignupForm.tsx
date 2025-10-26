"use client";

import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithYears } from "@/components/ui/date-picker";
import LoadingButton from "@/components/LoadingButton";
import { authClient } from "@/lib/auth/auth-client";
import { signupFormSchema, type SignupValues } from "@/lib/validation/auth";
import { validateSignupValues } from "@/lib/utils";

interface SignupFormProps {
  onSuccessfulSignup: () => void;
}

export default function SignupForm({ onSuccessfulSignup }: SignupFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: new Date(),
      password: "",
      repeatPassword: "",
      termsAccepted: false
    }
  });

  const password = form.watch("password");
  const repeatPassword = form.watch("repeatPassword");

  const { isSubmitting } = form.formState;

  async function onFormSubmit(values: SignupValues) {
    if (!validateSignupValues(form, values)) return;

    await authClient.signUp.email(
      {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth
      },
      {
        onSuccess: () => {
          toast.success(
            "Konto zostało utworzone pomyślnie! Sprawdź swoją skrzynkę e-mail, aby aktywować konto."
          );
          onSuccessfulSignup();
        },
        onError: () => {
          toast.error(
            "Wystąpił błąd podczas tworzenia konta. Spróbuj ponownie później."
          );
        }
      }
    );
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-3xl">Zarejestruj się</CardTitle>
        <CardDescription>
          Utwórz konto, aby korzystać z pełni funkcjonalności serwisu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Imię (wymagane)</FormLabel>
                    <FormControl>
                      <Input id={field.name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>
                      Nazwisko (wymagane)
                    </FormLabel>
                    <FormControl>
                      <Input id={field.name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>
                    Adres e-mail (wymagane)
                  </FormLabel>
                  <FormControl>
                    <Input type="email" id={field.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="dateOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>
                    Data urodzenia (wymagane)
                  </FormLabel>
                  <FormControl>
                    <DatePickerWithYears
                      value={field.value}
                      onValueChange={field.onChange}
                      className="bg-transparent"
                    />
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
                  <FormLabel htmlFor={field.name}>Hasło (wymagane)</FormLabel>
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
                  <FormLabel htmlFor={field.name}>
                    Potwierdź hasło (wymagane)
                  </FormLabel>
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
            <FormField
              name="termsAccepted"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        id={field.name}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor={field.name} className="mt-0">
                      Akceptuję regulamin
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              isPending={isSubmitting}
              idleText="Utwórz konto"
              loadingText="Wysyłanie..."
              // disabled={!passwordConditionsMet}
              className="w-full"
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
