"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { isValid as isValidDate } from "date-fns";
import { hash } from "@node-rs/argon2";
import { UserType } from "@prisma/client";
import EmployeeUserCreationEmail from "@/components/emails/EmployeeUserCreationEmail";
import prisma from "@/lib/prisma";
import { authAdmin } from "@/app/(staff)/staff/auth";
import { getSessionCookie } from "@/app/(staff)/staff/session";
import { resend } from "@/lib/resend";
import { hashingConfig } from "@/lib/constants";
import { employeeSchema, type EmployeeValues } from "@/lib/validation/employee";

export async function createEmployee(values: EmployeeValues) {
  try {
    const requestSessionCookie = await getSessionCookie();

    const { session } = await authAdmin(requestSessionCookie);

    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { userType, username, firstName, lastName, email, dateOfBirth } =
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

    if (!Object.values(UserType).includes(userType as UserType)) {
      return { error: "Nieprawidłowy typ użytkownika." };
    }

    const randomPassword = Math.random().toString(36).slice(-8);

    const passwordHash = await hash(randomPassword, hashingConfig);

    const createdUser = await prisma.user.create({
      data: {
        userType: userType as UserType,
        username: username || null,
        firstName,
        lastName,
        email,
        dateOfBirth,
        passwordHash,
        mustChangePassword: true
      }
    });

    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/dashboard/employees");

    const link = `${process.env.NEXT_PUBLIC_URL}/staff/login`;

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
          "Konto zostało utworzone, ale nie udało się wysłać e-maila z danymi logowania."
      };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function editEmployee(id: string, values: EmployeeValues) {
  try {
    const requestSessionCookie = await getSessionCookie();

    const { session } = await authAdmin(requestSessionCookie);

    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const { userType, username, firstName, lastName, email, dateOfBirth } =
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

    if (!Object.values(UserType).includes(userType as UserType)) {
      return { error: "Nieprawidłowy typ użytkownika." };
    }

    await prisma.user.update({
      where: { id },
      data: {
        userType: userType as UserType,
        username: username || null,
        firstName,
        lastName,
        email,
        dateOfBirth
      }
    });

    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/dashboard/employees");

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
