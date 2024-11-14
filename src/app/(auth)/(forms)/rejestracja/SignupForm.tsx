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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingButton from "@/components/LoadingButton";
import { signUp } from "@/app/(auth)/(forms)/actions";
import { signupFormSchema, type SignupValues } from "@/lib/validation/auth";
import { validateSignupValues } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
  onSuccessfulSignUp: () => void;
}

export default function SignupForm({ onSuccessfulSignUp }: SignupFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      dayOfBirth: "",
      monthOfBirth: "",
      yearOfBirth: "",
      password: "",
      confirmedPassword: "",
      terms: false
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
        onSuccessfulSignUp();
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
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
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
        <div className="space-y-2">
          <div>Data urodzenia (wymagane)</div>
          <div className="flex gap-2">
            <FormField
              name="dayOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor={field.name}>Dzień</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (day) => {
                            const dayString = day.toString().padStart(2, "0");
                            return (
                              <SelectItem
                                key={`day-${dayString}`}
                                value={dayString}
                              >
                                {dayString}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="monthOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor={field.name}>Miesiąc</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => {
                            const monthString = month
                              .toString()
                              .padStart(2, "0");
                            return (
                              <SelectItem
                                key={`month-${monthString}`}
                                value={monthString}
                              >
                                {monthString}
                              </SelectItem>
                            );
                          }
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="yearOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel htmlFor={field.name}>Rok</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from(
                          { length: 100 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <SelectItem
                            key={`year-${year}`}
                            value={year.toString()}
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
          name="confirmedPassword"
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
          name="terms"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox onCheckedChange={field.onChange} id={field.name} />
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
