"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { OrderType, UserType } from "@prisma/client";
import ReservationCreatedEmail from "@/components/emails/ReservationCreatedEmail";
import { validateSession } from "@/app/actions";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { isUserOldEnough } from "@/lib/utils";
import { checkoutFormSchema } from "@/lib/validation/checkout";
import type { SelectedSeat } from "@/lib/types";

export async function createCheckoutSession({
  showtimeId,
  selectedSeats,
  firstName,
  lastName,
  email,
  dateOfBirth
}: {
  showtimeId: string;
  selectedSeats: SelectedSeat[];
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
}) {
  try {
    const cookieStore = await cookies();
    const sessionCookie =
      cookieStore.get("auth_session") || cookieStore.get("guest_session");

    if (!sessionCookie) {
      return { error: "Unauthorized" };
    }

    const session = await validateSession(sessionCookie);

    if (!session) {
      return { error: "Sesja wygasła." };
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      select: {
        id: true,
        startTime: true,
        movie: {
          select: {
            title: true,
            genres: {
              select: {
                genre: {
                  select: {
                    ageRestriction: true
                  }
                }
              }
            }
          }
        },
        room: {
          select: {
            id: true,
            number: true
          }
        }
      }
    });

    if (!showtime) {
      return { error: "Seans nie istnieje." };
    }

    const alreadyBookedSeats = await prisma.seat.findMany({
      where: {
        showtimeId: showtime.id,
        roomId: showtime.room.id,
        rowNumber: {
          in: selectedSeats.map((seat) => seat.rowNumber)
        },
        seatNumber: {
          in: selectedSeats.map((seat) => seat.seatNumber)
        }
      }
    });

    if (alreadyBookedSeats.length !== 0) {
      return {
        error:
          "Co najmniej jedno z miejsc, które zostało wybrane, jest już zarezerwowane przez innego użytkownika."
      };
    }

    const highestAgeRestriction = showtime.movie.genres.reduce(
      (acc, genre) =>
        genre.genre.ageRestriction > acc ? genre.genre.ageRestriction : acc,
      0
    );

    const values = checkoutFormSchema.parse({
      firstName,
      lastName,
      email,
      dateOfBirth,
      type: "buy"
    });

    const isOldEnough = isUserOldEnough(
      values.dateOfBirth,
      highestAgeRestriction
    );

    if (!isOldEnough) {
      return {
        error: "Nie masz wystarczającego wieku, aby obejrzeć ten film."
      };
    }

    const tickets = await prisma.ticketInfo.findMany({
      select: {
        type: true,
        price: true
      }
    });

    if (!tickets) {
      return { error: "Bilety nie są dostępne." };
    }

    if (
      selectedSeats.some(
        (seat) => !tickets.find((ticket) => ticket.type === seat.ticketType)
      )
    ) {
      return { error: "Niepoprawny typ biletu." };
    }

    const existingRegularUser = await prisma.user.findFirst({
      where: { email: values.email, type: UserType.REGULAR },
      select: { id: true }
    });

    if (existingRegularUser && session.userId !== existingRegularUser.id) {
      return { error: "Nie możesz kupić biletu dla innego użytkownika." };
    }

    if (!existingRegularUser) {
      const existingGuestUser = await prisma.user.findFirst({
        where: { email: values.email, type: UserType.GUEST },
        select: { id: true }
      });

      if (!existingGuestUser) {
        const createdUser = await prisma.user.create({
          data: {
            type: UserType.GUEST,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            dateOfBirth: values.dateOfBirth
          }
        });

        const updatedSession = await prisma.session.update({
          where: { id: session.id },
          data: { userId: createdUser.id },
          select: { userId: true }
        });

        session.userId = updatedSession.userId;
      } else {
        session.userId = existingGuestUser.id;
      }
    }

    const createdOrder = await prisma.order.create({
      data: {
        type: OrderType.PAID,
        isPaid: false,
        userId: session.userId,
        showtimeId: showtime.id
      },
      select: {
        id: true
      }
    });

    const totalPrice = selectedSeats.reduce(
      (acc, seat) =>
        acc + tickets.find((ticket) => ticket.type === seat.ticketType)!.price,
      0
    );

    const product = await stripe.products.create({
      name: `Bilety na film ${showtime.movie.title}`,
      default_price_data: {
        currency: "PLN",
        unit_amount: totalPrice
      }
    });

    const cancelUrlParams = new URLSearchParams();
    cancelUrlParams.set("sessionId", session.id);
    for (const seat of selectedSeats) {
      cancelUrlParams.append("seat", `${seat.rowNumber}-${seat.seatNumber}`);
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/rezerwacje/${createdOrder.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/seans/${showtime.id}?${cancelUrlParams.toString()}`,
      payment_method_types: ["card", "paypal", "blik"],
      mode: "payment",
      metadata: {
        userId: session.userId,
        orderId: createdOrder.id,
        showtimeId: showtimeId,
        selectedSeats: JSON.stringify(selectedSeats)
      },
      line_items: [
        {
          price: product.default_price as string,
          quantity: 1
        }
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60
    });

    redirect(stripeSession.url!);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Internal Server Error" };
  }
}

export async function makeReservation({
  showtimeId,
  selectedSeats,
  firstName,
  lastName,
  email,
  dateOfBirth
}: {
  showtimeId: string;
  selectedSeats: SelectedSeat[];
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
}) {
  try {
    const cookieStore = await cookies();
    const sessionCookie =
      cookieStore.get("auth_session") || cookieStore.get("guest_session");

    if (!sessionCookie) {
      return { error: "Brak ciasteczka sesji." };
    }

    const session = await validateSession(sessionCookie);

    if (!session) {
      return { error: "Sesja wygasła." };
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      select: {
        id: true,
        startTime: true,
        movie: {
          select: {
            title: true,
            genres: {
              select: {
                genre: {
                  select: {
                    ageRestriction: true
                  }
                }
              }
            }
          }
        },
        room: {
          select: {
            id: true,
            number: true
          }
        }
      }
    });

    if (!showtime) {
      return { error: "Seans nie istnieje." };
    }

    const highestAgeRestriction = showtime.movie.genres.reduce(
      (acc, genre) =>
        genre.genre.ageRestriction > acc ? genre.genre.ageRestriction : acc,
      0
    );

    const values = checkoutFormSchema.parse({
      firstName,
      lastName,
      email,
      dateOfBirth,
      type: "buy"
    });

    const isOldEnough = isUserOldEnough(
      values.dateOfBirth,
      highestAgeRestriction
    );

    if (!isOldEnough) {
      return {
        error: "Nie masz wystarczającego wieku, aby obejrzeć ten film."
      };
    }

    const tickets = await prisma.ticketInfo.findMany();

    if (!tickets) {
      return { error: "Bilety nie są dostępne." };
    }

    const existingRegularUser = await prisma.user.findFirst({
      where: { email: values.email, type: UserType.REGULAR },
      select: { id: true }
    });

    if (existingRegularUser && session.userId !== existingRegularUser.id) {
      return { error: "Nie możesz kupić biletu dla innego użytkownika." };
    }

    if (!existingRegularUser) {
      const existingGuestUser = await prisma.user.findFirst({
        where: { email: values.email, type: UserType.GUEST },
        select: { id: true }
      });

      if (!existingGuestUser) {
        const createdUser = await prisma.user.create({
          data: {
            type: UserType.GUEST,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            dateOfBirth: values.dateOfBirth
          }
        });

        const updatedSession = await prisma.session.update({
          where: { id: session.id },
          data: { userId: createdUser.id },
          select: { userId: true }
        });

        session.userId = updatedSession.userId;
      } else {
        session.userId = existingGuestUser.id;
      }
    }

    const createdOrder = await prisma.order.create({
      data: {
        type: OrderType.RESERVATION,
        isPaid: false,
        userId: session.userId,
        showtimeId: showtime.id
      },
      select: {
        id: true
      }
    });

    await prisma.$transaction([
      prisma.seat.createMany({
        data: selectedSeats.map((seat) => ({
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
          showtimeId: showtime.id,
          roomId: showtime.room.id,
          userId: session.userId,
          orderId: createdOrder.id
        }))
      }),
      prisma.seatReservation.deleteMany({
        where: {
          showtimeId: showtime.id,
          rowNumber: { in: selectedSeats.map((seat) => seat.rowNumber) },
          seatNumber: { in: selectedSeats.map((seat) => seat.seatNumber) }
        }
      }),
      prisma.ticket.createMany({
        data: selectedSeats.map((seat) => ({
          type: seat.ticketType,
          price: tickets.find((ticket) => ticket.type === seat.ticketType)!
            .price,
          ticketInfoId: tickets.find(
            (ticket) => ticket.type === seat.ticketType
          )!.id,
          orderId: createdOrder.id
        }))
      })
    ]);

    const { error: resendError } = await resend.emails.send({
      from: "Cinema <notifications@notifications.filipjuszczak.pl>",
      to: [values.email],
      subject: "Cinema - Twoja rezerwacja została utworzona",
      react: ReservationCreatedEmail({
        firstName: values.firstName,
        showtime: {
          startTime: showtime.startTime,
          movie: showtime.movie.title,
          room: showtime.room.number
        },
        seats: selectedSeats
      })
    });

    if (resendError) {
      return {
        error:
          "Rezerwacja została utworzona, ale nie udało się wysłać wiadomości email. Skontaktuj się z działem obsługi klienta."
      };
    }

    return redirect(`/twoja-rezerwacja?id=${createdOrder.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Internal Server Error" };
  }
}
