"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import prisma from "@/lib/prisma";
import { authAdmin } from "@/app/(staff)/staff/auth";
import { employeeSchema, type EmployeeValues } from "@/lib/validation/employee";
import { isValidDate } from "@/lib/utils";
import { UserType } from "@prisma/client";
import { resend } from "@/lib/resend";
import EmployeeUserCreationEmail from "@/components/emails/EmployeeUserCreationEmail";

export async function createEmployee(values: EmployeeValues) {
  try {
    const { session } = await authAdmin();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const {
      userType,
      username,
      firstName,
      lastName,
      email,
      dayOfBirth,
      monthOfBirth,
      yearOfBirth
    } = employeeSchema.parse(values);

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

    if (!isValidDate(dayOfBirth, monthOfBirth, yearOfBirth)) {
      return { error: "Nieprawidłowa data." };
    }

    if (!Object.values(UserType).includes(userType as UserType)) {
      return { error: "Nieprawidłowy typ użytkownika." };
    }

    const userId = generateIdFromEntropySize(10);
    const randomPassword = Math.random().toString(36).slice(-8);

    const passwordHash = await hash(randomPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    const createdUser = await prisma.user.create({
      data: {
        id: userId,
        userType: userType as UserType,
        username: username || null,
        firstName,
        lastName,
        email,
        dateOfBirth: new Date(
          Number(yearOfBirth),
          Number(monthOfBirth) - 1,
          Number(dayOfBirth)
        ),
        passwordHash,
        mustChangePassword: true
      }
    });

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
      return { error: "Nie udało się wysłać e-maila z danymi logowania." };
    }

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}

export async function editEmployee(id: string, values: EmployeeValues) {
  try {
    const { session } = await authAdmin();
    if (!session || !session.userId) {
      return redirect("/staff/login");
    }

    const {
      userType,
      username,
      firstName,
      lastName,
      email,
      dayOfBirth,
      monthOfBirth,
      yearOfBirth
    } = employeeSchema.parse(values);

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

    if (!isValidDate(dayOfBirth, monthOfBirth, yearOfBirth)) {
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
        dateOfBirth: new Date(
          Number(yearOfBirth),
          Number(monthOfBirth) - 1,
          Number(dayOfBirth)
        )
      }
    });

    return { success: true };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }
}
