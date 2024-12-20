import { NextResponse, type NextRequest } from "next/server";
import { getMovies } from "@/app/(main)/filmy/data";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const page = params.get("page") ?? "1";
  const title = params.get("title") ?? undefined;
  const genre = params.getAll("genre") ?? undefined;
  const viewingMode = params.getAll("viewingMode") as ViewingMode[];
  const screenFormat = params.getAll("screenFormat") as ScreenFormat[];

  const data = await getMovies({
    page,
    title,
    genre,
    viewingMode,
    screenFormat
  });

  return NextResponse.json(data);
}
