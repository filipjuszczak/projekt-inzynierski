"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { isValid as isValidDate } from "date-fns";
import { hash } from "@node-rs/argon2";
import { Role } from "@prisma/client";
import EmployeeUserCreationEmail from "@/components/emails/EmployeeUserCreationEmail";
import { authenticateUser } from "@/auth";
import prisma from "@/lib/prisma";
import { getSessionCookie } from "@/lib/session";
import { resend } from "@/lib/resend";
import { GENERIC_ERROR_MESSAGE, HASHING_CONFIG } from "@/lib/constants";
import { employeeSchema, type EmployeeValues } from "@/lib/validation/employee";

export async function createEmployee(values: EmployeeValues) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.ADMIN,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { role, username, firstName, lastName, email, dateOfBirth } =
      employeeSchema.parse(values);

    if (username) {
      const existingUserWithUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUserWithUsername) {
        return { error: "Użytkownik o takiej nazwie już istnieje." };
      }
    }

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

    const randomPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await hash(randomPassword, HASHING_CONFIG);

    const createdUser = await prisma.user.create({
      data: {
        role: role as Role,
        username: username || null,
        firstName,
        lastName,
        email,
        dateOfBirth,
        password: hashedPassword,
        mustChangePassword: true
      }
    });

    const link = `${process.env.NEXT_PUBLIC_URL}/panel-pracownika/logowanie`;

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [email],
      subject: "Cinema - witaj w naszym zespole!",
      react: EmployeeUserCreationEmail({
        firstName: createdUser.firstName,
        username: createdUser.username || "",
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
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.ADMIN,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { role, username, firstName, lastName, email, dateOfBirth } =
      employeeSchema.parse(values);

    if (username) {
      const existingUserWithUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUserWithUsername && existingUserWithUsername.id !== id) {
        return { error: "Użytkownik o takiej nazwie już istnieje." };
      }
    }

    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== id) {
      return { error: "Użytkownik z tym adresem e-mail już istnieje." };
    }

    if (!isValidDate(dateOfBirth)) {
      return { error: "Nieprawidłowa data." };
    }

    if (!Object.values(Role).includes(role as Role)) {
      return { error: "Nieprawidłowy typ użytkownika." };
    }

    await prisma.user.update({
      where: { id },
      data: {
        role: role as Role,
        username: username || null,
        firstName,
        lastName,
        email,
        dateOfBirth
      }
    });
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
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.ADMIN,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

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
