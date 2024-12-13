"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { Role } from "@prisma/client";
import { authenticateUser } from "@/auth";
import { getSessionCookie } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function setFeaturedMovie(movieId: string) {
  try {
    const requestSessionCookie = await getSessionCookie();

    if (!requestSessionCookie) {
      return redirect("/panel-pracownika/logowanie");
    }

    const { session } = await authenticateUser(
      Role.EMPLOYEE,
      requestSessionCookie
    );

    if (!session || !session.userId) {
      return redirect("/panel-pracownika/logowanie");
    }

    const existingMovie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!existingMovie) {
      return { error: "Wybrany film nie istnieje." };
    }

    const currentFeaturedMovie = await prisma.movie.findFirst({
      where: { isFeatured: true },
      select: { id: true }
    });

    if (currentFeaturedMovie) {
      await prisma.movie.update({
        where: { id: currentFeaturedMovie?.id || undefined },
        data: { isFeatured: false }
      });
    }

    await prisma.movie.update({
      where: { id: movieId },
      data: { isFeatured: true }
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Ups! Coś poszło nie tak. Spróbuj później." };
  }

  revalidatePath("/");

  return { success: true };
}
