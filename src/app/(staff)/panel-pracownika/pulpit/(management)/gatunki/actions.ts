"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Role } from "@prisma/client";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";
import { authEmployee } from "@/lib/auth/helpers";
import { genreSchema, type GenreValues } from "@/lib/validation/genre";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function createGenre(values: GenreValues) {
  try {
    const session = await authEmployee({ returnRedirect: true });
    if (session instanceof NextResponse) return session;

    const { name, ageRestriction } = genreSchema.parse(values);

    const existingGenre = await prisma.genre.findFirst({
      where: { name }
    });

    if (existingGenre) {
      return { error: "Gatunek o tej nazwie już istnieje." };
    }

    await prisma.genre.create({
      data: {
        name,
        ageRestriction: Number(ageRestriction),
        createdBy: session.user.id,
        updatedBy: null
      }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/gatunki");
  revalidatePath("/panel-pracownika/pulpit/filmy/nowy");

  return { success: true };
}

export async function editGenre(id: string, values: GenreValues) {
  try {
    const session = await authEmployee({ returnRedirect: true });
    if (session instanceof NextResponse) return session;

    const { name, ageRestriction } = genreSchema.parse(values);

    const existingGenre = await prisma.genre.findFirst({
      where: { name }
    });

    if (existingGenre && existingGenre.id !== id) {
      return { error: "Gatunek o tej nazwie już istnieje." };
    }

    await prisma.genre.update({
      where: { id },
      data: {
        name,
        ageRestriction: Number(ageRestriction),
        updatedBy: session.user.id
      }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/gatunki");
  revalidatePath("/panel-pracownika/pulpit/filmy/nowy");

  return { success: true };
}

export async function deleteGenre(id: string) {
  try {
    await authEmployee({ returnRedirect: true });

    const existingGenre = await prisma.genre.findFirst({
      where: { id }
    });

    if (!existingGenre) {
      return { error: "Gatunek nie istnieje." };
    }

    await prisma.genre.delete({ where: { id } });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: GENERIC_ERROR_MESSAGE };
  }

  revalidatePath("/panel-pracownika/pulpit/gatunki");
  revalidatePath("/panel-pracownika/pulpit/filmy/nowy");

  return { success: true };
}
