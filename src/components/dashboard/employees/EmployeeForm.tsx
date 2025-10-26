"use client";

import { useTransition } from "react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Role } from "@prisma/client";
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
import { DatePickerWithYears } from "@/components/ui/date-picker";
import {
  createEmployee,
  editEmployee
} from "@/app/(staff)/panel-pracownika/pulpit/(management)/pracownicy/actions";
import { validateEmployeeValues } from "@/lib/utils";
import { employeeSchema, EmployeeValues } from "@/lib/validation/employee";

const userRoleLabels = [
  {
    role: Role.admin,
    label: "Administrator"
  },
  {
    role: Role.employee,
    label: "Pracownik"
  }
];

interface EmployeeFormProps {
  id?: string;
  role?: Role;
  username?: string;
  name?: string;
  email?: string;
  dateOfBirth?: Date;
}

export default function EmployeeForm({
  id = "",
  role = Role.employee,
  username = "",
  name = "",
  email = "",
  dateOfBirth = new Date()
}: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();

  const [firstName, lastName] = name.split(" ");

  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role,
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
        return redirect("/panel-pracownika/pulpit/pracownicy");
      } else {
        toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          name="role"
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
                    {userRoleLabels.map((label) => (
                      <SelectItem key={label.role} value={label.role}>
                        {label.label}
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
                <DatePickerWithYears
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
