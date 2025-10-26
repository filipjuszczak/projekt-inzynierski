"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { isValid as isValidDate } from "date-fns";
import { Role } from "@prisma/client";
import EmployeeUserCreationEmail from "@/components/emails/EmployeeUserCreationEmail";
import prisma from "@/lib/prisma";
import { authAdmin } from "@/lib/auth/helpers";
import { resend } from "@/lib/resend";
import { DEFAULT_EMAIL_SENDER, GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { employeeSchema, type EmployeeValues } from "@/lib/validation/employee";
import { auth } from "@/lib/auth/auth";
import { generateRandomPassword } from "@/lib/utils";
import { headers } from "next/headers";

export async function createEmployee(values: EmployeeValues) {
  try {
    await authAdmin({ returnRedirect: true });

    const { role, firstName, lastName, email, dateOfBirth } =
      employeeSchema.parse(values);

    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserWithEmail) {
      return { error: "Użytkownik z tym adresem e-mail już istnieje." };
    }

    if (!isValidDate(dateOfBirth)) {
      return { error: "Nieprawidłowa data." };
    }

    if (!Object.values(Role).includes(role as Role)) {
      return { error: "Nieprawidłowy typ użytkownika." };
    }

    const randomPassword = generateRandomPassword(8);

    const { user: createdUser } = await auth.api.createUser({
      body: {
        name: `${firstName} ${lastName}`,
        email,
        password: randomPassword,
        role: role as Role,
        data: {
          dateOfBirth
        }
      }
    });

    const link = `${process.env.NEXT_PUBLIC_URL}/panel-pracownika/logowanie`;

    const { error: resendError } = await resend.emails.send({
      from: DEFAULT_EMAIL_SENDER,
      to: [email],
      subject: "Sunema - witaj w naszym zespole!",
      react: EmployeeUserCreationEmail({
        name: createdUser.name,
        email: createdUser.email,
        password: randomPassword,
        link
      })
    });

    if (resendError) {
      return {
        error:
          "Konto zostało utworzone, ale nie udało się wysłać e-mail'a z danymi logowania."
      };
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/pracownicy");

  return { success: true };
}

export async function editEmployee(id: string, values: EmployeeValues) {
  try {
    await authAdmin({ returnRedirect: true });

    const { role, firstName, lastName, dateOfBirth } =
      employeeSchema.parse(values);

    if (!isValidDate(dateOfBirth)) {
      return { error: "Nieprawidłowa data." };
    }

    if (!Object.values(Role).includes(role as Role)) {
      return { error: "Nieprawidłowy typ użytkownika." };
    }

    const requestHeaders = await headers();

    await Promise.all([
      auth.api.adminUpdateUser({
        headers: requestHeaders,
        body: {
          userId: id,
          data: {
            name: `${firstName} ${lastName}`,
            role: role as Role,
            dateOfBirth
          }
        }
      }),
      auth.api.setRole({
        headers: requestHeaders,
        body: {
          userId: id,
          role: role as Role
        }
      })
    ]);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/pracownicy");

  return { success: true };
}

export async function deleteEmployee(employeeId: string) {
  try {
    await authAdmin({ returnRedirect: true });

    const existingEmployee = await prisma.user.findUnique({
      where: { id: employeeId }
    });

    if (!existingEmployee) {
      return { error: "Konto pracownika o podanym ID nie istnieje." };
    }

    await prisma.user.delete({
      where: { id: employeeId }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/pracownicy");

  return { success: true };
}
