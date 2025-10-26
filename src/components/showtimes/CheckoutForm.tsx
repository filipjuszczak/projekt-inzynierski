"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePickerWithYears } from "@/components/ui/date-picker";
import LoadingButton from "@/components/LoadingButton";
import { useUserStore } from "@/hooks/use-user-store";
import {
  createCheckoutSession,
  makeReservation
} from "@/app/(main)/seans/[id]/actions";
import {
  checkoutFormSchema,
  type CheckoutFormValues
} from "@/lib/validation/checkout";
import type { SelectedSeat } from "@/lib/types";
import { authClient } from "@/lib/auth/auth-client";

interface CheckoutFormProps {
  totalPrice: number;
  showtimeId: string;
  selectedSeats: SelectedSeat[];
  onCheckoutStart: () => void;
  onCheckoutCancel: () => void;
}

export default function CheckoutForm({
  totalPrice,
  showtimeId,
  selectedSeats,
  onCheckoutStart,
  onCheckoutCancel
}: CheckoutFormProps) {
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();

  const [firstName, lastName] = session?.user.name.split(" ") || ["", ""];

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      email: session?.user.email || "",
      dateOfBirth: new Date(session?.user.dateOfBirth || new Date()),
      type: "buy"
    }
  });

  const type = form.watch("type");

  async function onFormSubmit(values: CheckoutFormValues) {
    startTransition(async () => {
      if (values.type === "buy") {
        onCheckoutStart();

        const result = await createCheckoutSession({
          showtimeId,
          selectedSeats,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          dateOfBirth: values.dateOfBirth
        });

        if ("error" in result) {
          onCheckoutCancel();
          toast.error(result.error);
        }
      } else {
        const result = await makeReservation({
          showtimeId,
          selectedSeats,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          dateOfBirth: values.dateOfBirth
        });

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        if ("success" in result) {
          toast.success(
            "Udało się utworzyć rezerwację! Sprawdź swoją skrzynkę pocztową."
          );
        } else {
          toast.error("Ups! Coś poszło nie tak. Spróbuj ponownie.");
        }
      }
    });
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4 *:w-full md:flex-row">
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
                  <Input id={field.name} {...field} />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy" id="r1" />
                      <Label htmlFor="r1">Kup bilety</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reservation" id="r2" />
                      <Label htmlFor="r2">Zarezerwuj</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="text-xl font-bold">Łącznie: {totalPrice} PLN</div>
          <LoadingButton
            idleText={type === "buy" ? "Kup bilety" : "Zarezerwuj"}
            loadingText="Wysyłanie..."
            isPending={isPending}
            className="w-full"
          />
        </form>
      </Form>
    </div>
  );
}
