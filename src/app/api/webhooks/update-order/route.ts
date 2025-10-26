import { NextResponse, type NextRequest } from "next/server";
import { UserActivities } from "@prisma/client";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import TicketsEmail from "@/components/emails/TicketsEmail";
import prisma from "@/lib/prisma";
import { DEFAULT_EMAIL_SENDER } from "@/lib/constants";
import type Stripe from "stripe";
import type { SelectedSeat } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, orderId, selectedSeats, showtimeId } =
        session.metadata || {
          userId: null,
          orderId: null,
          selectedSeats: null,
          showtimeId: null
        };

      if (!userId || !orderId || !selectedSeats || !showtimeId) {
        throw new Error("Missing metadata");
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true }
      });

      if (!existingUser) {
        throw new Error("User not found");
      }

      const showtime = await prisma.showtime.findUnique({
        where: { id: showtimeId },
        select: {
          id: true,
          startTime: true,
          movie: {
            select: {
              title: true
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
        throw new Error("Showtime not found");
      }

      const tickets = await prisma.ticketInfo.findMany();

      if (!tickets) {
        throw new Error("Tickets not found");
      }

      const createdOrder = await prisma.order.update({
        where: { id: orderId },
        data: { isPaid: true },
        select: { id: true }
      });

      const selectedSeatsArr = JSON.parse(selectedSeats) as SelectedSeat[];

      const [createdSeats] = await prisma.$transaction([
        prisma.seat.createManyAndReturn({
          data: selectedSeatsArr.map((seat) => ({
            rowNumber: seat.rowNumber,
            seatNumber: seat.seatNumber,
            showtimeId: showtime.id,
            roomId: showtime.room.id,
            userId: userId,
            orderId: createdOrder.id
          })),
          select: {
            id: true,
            rowNumber: true,
            seatNumber: true
          }
        }),
        prisma.seatReservation.deleteMany({
          where: {
            showtimeId: showtime.id,
            rowNumber: { in: selectedSeatsArr.map((seat) => seat.rowNumber) },
            seatNumber: { in: selectedSeatsArr.map((seat) => seat.seatNumber) }
          }
        }),
        prisma.ticket.createMany({
          data: selectedSeatsArr.map((seat) => ({
            type: seat.ticketType,
            price: tickets.find((ticket) => ticket.type === seat.ticketType)!
              .price,
            ticketInfoId: tickets.find(
              (ticket) => ticket.type === seat.ticketType
            )!.id,
            orderId: createdOrder.id
          }))
        }),
        prisma.userActivity.create({
          data: {
            userId: existingUser.id,
            type: UserActivities.CREATED_RESERVATION
          }
        })
      ]);

      await resend.emails.send({
        from: DEFAULT_EMAIL_SENDER,
        to: [existingUser.email],
        subject: "Cinema - Twoje bilety",
        react: TicketsEmail({
          firstName: existingUser.name.split(" ")[0],
          showtime: {
            startTime: showtime.startTime,
            movie: showtime.movie.title,
            room: showtime.room.number
          },
          seats: createdSeats
        })
      });

      return NextResponse.json({ result: event, success: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
