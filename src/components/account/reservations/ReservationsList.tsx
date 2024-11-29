import { redirect } from "next/navigation";

import { getReservations } from "@/app/(main)/konto/data";
import { getSessionCookie } from "@/lib/session";
import { authenticateUser } from "@/auth";
import { Role } from "@prisma/client";
import Reservations from "@/components/account/reservations/Reservations";

export default async function ReservationsList() {
  const sessionCookie = await getSessionCookie();

  if (!sessionCookie) {
    redirect("/logowanie");
  }

  const { user, session } = await authenticateUser(Role.NORMAL, sessionCookie);

  if (!user || !session || !session.userId) {
    redirect("/logowanie");
  }

  const reservations = await getReservations(user.id);

  return <Reservations reservations={reservations} />;
}
