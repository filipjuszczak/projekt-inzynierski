import { NextRequest, NextResponse } from "next/server";
import { getShowtimes } from "@/app/(main)/repertuar/data";
import type { ViewingMode, ScreenFormat } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters = {
    date: searchParams.get("date") ?? undefined,
    title: searchParams.get("title") ?? undefined,
    genre: searchParams.get("genre") ?? undefined,
    viewingMode: searchParams.get("viewingMode") as ViewingMode,
    screenFormat: searchParams.get("screenFormat") as ScreenFormat
  };

  const showtimes = await getShowtimes(filters);

  return NextResponse.json(showtimes);
}
