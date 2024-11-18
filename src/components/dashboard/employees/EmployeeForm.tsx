"use client";

import { useEffect, useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserType } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { DatePicker } from "@/components/ui/date-picker";
import {
  createEmployee,
  editEmployee
} from "@/app/(staff)/staff/dashboard/(management)/employees/actions";
import { employeeSchema, EmployeeValues } from "@/lib/validation/employee";
import { validateEmployeeValues } from "@/lib/utils";

const userTypeLabels = [
  {
    type: UserType.ADMIN,
    label: "Administrator"
  },
  {
    type: UserType.EMPLOYEE,
    label: "Pracownik"
  }
];

interface EmployeeFormProps {
  id?: string;
  userType?: UserType;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: Date;
}

export default function EmployeeForm({
  id = "",
  userType = UserType.EMPLOYEE,
  username = "",
  firstName = "",
  lastName = "",
  email = "",
  dateOfBirth = new Date()
}: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      userType,
      username,
      firstName,
      lastName,
      email,
      dateOfBirth
    }
  });

  async function onFormSubmit(values: EmployeeValues) {
    if (!validateEmployeeValues(form, values)) return;

    startTransition(async () => {
      let result;
      let error;

      if (id) {
        result = await editEmployee(id, values);
        if ("error" in result) {
          error = result.error;
        }
      } else {
        result = await createEmployee(values);
        if ("error" in result) {
          error = result.error;
        }
      }

      if (error) {
        toast.error(error);
        return;
      }

      if ("success" in result && result.success) {
        toast.success("Pomyślnie zapisano dane pracownika.");
        return redirect("/staff/dashboard/employees");
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="userType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Typ konta</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {userTypeLabels.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <DatePicker
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isPending}
          idleText={id ? "Zapisz" : "Utwórz"}
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
