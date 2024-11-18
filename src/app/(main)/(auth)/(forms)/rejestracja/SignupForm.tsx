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
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingButton from "@/components/LoadingButton";
import { signUp } from "@/app/(main)/(auth)/(forms)/actions";
import { signupFormSchema, type SignupValues } from "@/lib/validation/auth";
import { validateSignupValues } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
  onSuccessfulSignup: () => void;
}

export default function SignupForm({ onSuccessfulSignup }: SignupFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: new Date(),
      password: "",
      repeatPassword: "",
      termsAccepted: false
    }
  });

  async function onFormSubmit(values: SignupValues) {
    if (!validateSignupValues(form, values)) return;

    startTransition(async () => {
      const result = await signUp(values);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        onSuccessfulSignup();
        toast.success(
          "Konto zostało utworzone pomyślnie! Sprawdź swoją skrzynkę e-mail, aby aktywować konto."
        );
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Nazwa użytkownika</FormLabel>
              <FormControl>
                <Input id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel htmlFor={field.name}>Nazwisko (wymagane)</FormLabel>
              <FormControl>
                <Input id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <DatePicker
                  value={field.value}
                  onValueChange={field.onChange}
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
                      <span className="sr-only">Hide password</span>
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
                      <span className="sr-only">Show password</span>
                    </Button>
                  )}
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
          name="termsAccepted"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox id={field.name} onCheckedChange={field.onChange} />
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
          isPending={isPending}
          idleText="Utwórz konto"
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
