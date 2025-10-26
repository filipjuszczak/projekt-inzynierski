import { NextResponse, type NextRequest } from "next/server";
import { getMovies } from "@/app/(main)/filmy/data";
import type { ScreenFormat, ViewingMode } from "@prisma/client";

export async function GET(request: NextRequest) {
  // const params = new URLSearchParams(request.nextUrl.searchParams);
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") ?? "1";
  const title = searchParams.get("title") ?? undefined;
  const genre = searchParams.getAll("genre") ?? undefined;
  const viewingMode = searchParams.getAll("viewingMode") as ViewingMode[];
  const screenFormat = searchParams.getAll("screenFormat") as ScreenFormat[];

  const data = await getMovies({
    page,
    title,
    genre,
    viewingMode,
    screenFormat
  });

  return NextResponse.json(data);
}
