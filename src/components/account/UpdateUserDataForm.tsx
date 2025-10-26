"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
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
import { DatePickerWithYears } from "@/components/ui/date-picker";
import LoadingButton from "@/components/LoadingButton";
import { validateUserDataValues } from "@/lib/utils";
import {
  updateUserDataSchema,
  type UpdateUserDataValues
} from "@/lib/validation/user";
import { authClient } from "@/lib/auth/auth-client";
import { trackUserActivityClient } from "@/lib/auth/track-activity";
import { UserActivities } from "@prisma/client";

export default function UpdateUserDataForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const queryClient = useQueryClient();

  const form = useForm<UpdateUserDataValues>({
    resolver: zodResolver(updateUserDataSchema),
    defaultValues: {
      firstName: session?.user.name.split(" ")[0] || "",
      lastName: session?.user.name.split(" ")[1] || "",
      email: session?.user.email || "",
      dateOfBirth: session?.user.dateOfBirth || new Date()
    }
  });

  const { isSubmitting } = form.formState;

  async function handleUpdateUserData(values: UpdateUserDataValues) {
    if (!validateUserDataValues(form, values)) return;

    const promises = [
      authClient.updateUser({
        name: `${values.firstName} ${values.lastName}`,
        dateOfBirth: values.dateOfBirth
      })
    ];

    if (session?.user.email !== values.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: values.email
        })
      );
    }

    const result = await Promise.all(promises);
    const updateUserResult = result[0];
    const emailResult = result[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.error("Wystąpił błąd podczas aktualizacji danych.");
    } else if (emailResult.error) {
      toast.error("Wystąpił błąd podczas zmiany adresu e-mail.");
    } else {
      await trackUserActivityClient(UserActivities.PERSONAL_DATA_CHANGED);

      if (values.email !== session?.user.email) {
        toast.success(
          "Potwierdź swój nowy adres e-mail, aby ukończyć proces zmiany."
        );
      } else {
        toast.success("Aktualizacja danych przebiegła pomyślnie!");
        queryClient.invalidateQueries({ queryKey: ["userActivities"] });
      }

      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateUserData)}
        className="space-y-4"
      >
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
        <LoadingButton
          isPending={isSubmitting}
          idleText="Zapisz"
          loadingText="Zapisywanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
