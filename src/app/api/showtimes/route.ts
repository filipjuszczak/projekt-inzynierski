import { NextRequest, NextResponse } from "next/server";
import { getShowtimes } from "@/app/(main)/repertuar/data";
import type { ViewingMode, ScreenFormat } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? undefined;
  const title = searchParams.get("title") ?? undefined;
  const genre = searchParams.get("genre") ?? undefined;
  const viewingMode = searchParams.get("viewingMode") as ViewingMode;
  const screenFormat = searchParams.get("screenFormat") as ScreenFormat;

  const showtimes = await getShowtimes({
    date,
    title,
    genre,
    viewingMode,
    screenFormat
  });

  return NextResponse.json(showtimes);
}
