"use client";

import { useEffect, useTransition } from "react";
import { redirect } from "next/navigation";
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
import { useFetchEmployeeById } from "@/app/(staff)/staff/dashboard/(main)/employees/queries";
import {
  createEmployee,
  editEmployee
} from "@/app/(staff)/staff/dashboard/(main)/employees/actions";
import { employeeSchema, EmployeeValues } from "@/lib/validation/employee";
import { validateEmployeeValues } from "@/lib/utils";
import { UserType } from "@prisma/client";

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
  employeeId?: string;
}

export default function EmployeeForm({ employeeId }: EmployeeFormProps) {
  const {
    data: employeeData,
    isFetching: employeeDataIsFetching,
    isError: employeeDataIsError
  } = useFetchEmployeeById(employeeId);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      userType: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      dayOfBirth: "",
      monthOfBirth: "",
      yearOfBirth: ""
    }
  });

  useEffect(() => {
    if (employeeData) {
      const employeeDateOfBirth = new Date(employeeData.dateOfBirth);
      form.reset({
        userType: employeeData.userType,
        username: employeeData.username || "",
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        dayOfBirth: employeeDateOfBirth.getDate().toString().padStart(2, "0"),
        monthOfBirth: (employeeDateOfBirth.getMonth() + 1)
          .toString()
          .padStart(2, "0"),
        yearOfBirth: employeeDateOfBirth.getFullYear().toString()
      });
    }
  }, [employeeData, form]);

  async function onFormSubmit(values: EmployeeValues) {
    if (!validateEmployeeValues(form, values)) return;

    startTransition(async () => {
      let result;
      let error;

      if (employeeId) {
        result = await editEmployee(employeeId, values);
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={employeeDataIsFetching || employeeDataIsError}
              >
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
                <Input
                  id={field.name}
                  disabled={employeeDataIsFetching || employeeDataIsError}
                  {...field}
                />
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
                <Input
                  id={field.name}
                  disabled={employeeDataIsFetching || employeeDataIsError}
                  {...field}
                />
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
                <Input
                  id={field.name}
                  disabled={employeeDataIsFetching || employeeDataIsError}
                  {...field}
                />
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
                <Input
                  id={field.name}
                  disabled={employeeDataIsFetching || employeeDataIsError}
                  {...field}
                />
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
                    value={field.value}
                    disabled={employeeDataIsFetching || employeeDataIsError}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (day) => (
                            <SelectItem
                              key={`day-${day.toString().padStart(2, "0")}`}
                              value={day.toString().padStart(2, "0")}
                            >
                              {day.toString().padStart(2, "0")}
                            </SelectItem>
                          )
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
                    value={field.value}
                    disabled={employeeDataIsFetching || employeeDataIsError}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem
                              key={`month-${month.toString().padStart(2, "0")}`}
                              value={month.toString().padStart(2, "0")}
                            >
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          )
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
                    value={field.value}
                    disabled={employeeDataIsFetching || employeeDataIsError}
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
                          <SelectItem key={year} value={year.toString()}>
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
        <LoadingButton
          isPending={isPending}
          isFetching={employeeDataIsFetching}
          isError={employeeDataIsError}
          idleText={employeeId ? "Zapisz" : "Utwórz"}
          loadingText="Wysyłanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
