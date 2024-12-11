import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
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

      const createdOrder = await prisma.order.update({
        where: { id: orderId },
        data: { isPaid: true },
        select: { id: true }
      });

      const selectedSeatsArr = JSON.parse(selectedSeats) as SelectedSeat[];

      const showtime = await prisma.showtime.findUnique({
        where: { id: showtimeId },
        select: {
          id: true,
          room: {
            select: {
              id: true
            }
          }
        }
      });

      if (!showtime) {
        throw new Error("Showtime not found");
      }

      await prisma.seat.createMany({
        data: selectedSeatsArr.map((seat) => ({
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
          showtimeId: showtime.id,
          roomId: showtime.room.id,
          userId: userId,
          orderId: createdOrder.id
        }))
      });

      await prisma.seatReservation.deleteMany({
        where: {
          showtimeId: showtime.id,
          rowNumber: { in: selectedSeatsArr.map((seat) => seat.rowNumber) },
          seatNumber: { in: selectedSeatsArr.map((seat) => seat.seatNumber) }
        }
      });

      const tickets = await prisma.ticketInfo.findMany();

      if (!tickets) {
        throw new Error("Tickets not found");
      }

      await prisma.ticket.createMany({
        data: selectedSeatsArr.map((seat) => ({
          type: seat.ticketType,
          price: tickets.find((ticket) => ticket.type === seat.ticketType)!
            .price,
          ticketInfoId: tickets.find(
            (ticket) => ticket.type === seat.ticketType
          )!.id,
          orderId: createdOrder.id
        }))
      });
    }

    revalidatePath("/panel-pracownika/pulpit");

    return NextResponse.json({ result: event, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
