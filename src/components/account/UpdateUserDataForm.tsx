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
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import LoadingButton from "@/components/LoadingButton";
import { updateUserData } from "@/app/(main)/konto/actions";
import { useUserStore } from "@/hooks/use-user-store";
import { validateUserDataValues } from "@/lib/utils";
import {
  updateUserDataSchema,
  type UpdateUserDataValues
} from "@/lib/validation/user";

interface UpdateUserDataFormProps {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
}

export default function UpdateUserDataForm({
  id,
  username,
  firstName,
  lastName,
  email,
  dateOfBirth
}: UpdateUserDataFormProps) {
  const [isPending, startTransition] = useTransition();
  const setUserData = useUserStore(useShallow((state) => state.setUserData));

  const form = useForm<UpdateUserDataValues>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: {
      username,
      firstName,
      lastName,
      email,
      dateOfBirth
    }
  });

  async function handleUpdateUserData(values: UpdateUserDataValues) {
    if (!validateUserDataValues(form, values)) return;

    startTransition(async () => {
      const result = await updateUserData(id, values);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      if ("success" in result && result.success) {
        setUserData({
          username: result.userData.username || "",
          firstName: result.userData.firstName,
          lastName: result.userData.lastName,
          email: result.userData.email,
          role: result.userData.role
        });
        toast.success("Dane zostały pomyślnie zapisane.");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateUserData)}
        className="space-y-4"
      >
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Imię</FormLabel>
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
                <FormLabel htmlFor={field.name}>Nazwisko</FormLabel>
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
              <FormLabel htmlFor={field.name}>Adres e-mail</FormLabel>
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
            <FormItem className="flex flex-col gap-2">
              <FormLabel htmlFor={field.name}>Data urodzenia</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onValueChange={field.onChange}
                  className="bg-transparent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          idleText="Zapisz"
          loadingText="Zapisywanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
