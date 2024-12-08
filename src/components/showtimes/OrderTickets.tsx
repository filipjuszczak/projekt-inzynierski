"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { TicketType } from "@prisma/client";
import SelectTickets from "@/components/showtimes/SelectTickets";
import SelectSeats from "@/components/showtimes/SelectSeats";
import Summary from "@/components/showtimes/Summary";
import { MAX_SELECTED_SEATS } from "@/lib/constants";

interface OrderTicketsProps {
  showtime: {
    id: string;
    movie: {
      id: string;
      title: string;
      shortDescription: string;
      posterUrl: string | null;
      genres: {
        id: string;
        name: string;
      }[];
    };
    room: {
      id: string;
      numberOfRows: number;
      seatsPerRow: number;
    };
    seats: {
      id: string;
      rowNumber: number;
      seatNumber: number;
    }[];
  };
  tickets: Record<
    string,
    {
      price: number;
    }
  >;
}

export type Step = "select-seats" | "select-tickets" | "summary";

export interface SelectedSeat {
  id: string;
  rowNumber: number;
  seatNumber: number;
  ticketType: TicketType;
}

export default function OrderTickets({ showtime, tickets }: OrderTicketsProps) {
  const [currentStep, setCurrentStep] = useState<Step>("select-seats");
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const ref = useRef(selectedSeats);

  useEffect(() => {
    ref.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    async function onBeforeUnload(event: BeforeUnloadEvent) {
      const baseUrl = window.location.origin;
      navigator.sendBeacon(
        `${baseUrl}/api/seats/unlock-selected`,
        JSON.stringify({
          showtimeId: showtime.id,
          seats: selectedSeats.map((seat) => ({
            rowNumber: seat.rowNumber,
            seatNumber: seat.seatNumber
          }))
        })
      );
    }

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  function onSeatClick(rowNumber: number, seatNumber: number) {
    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.find(
        (seat) => seat.id === `${rowNumber}-${seatNumber}`
      );

      if (isAlreadySelected) {
        return prev.filter((seat) => seat.id !== `${rowNumber}-${seatNumber}`);
      } else {
        if (prev.length >= MAX_SELECTED_SEATS) {
          toast.error(
            `Możesz wybrać maksymalnie ${MAX_SELECTED_SEATS} miejsc.`
          );
          return prev;
        }

        return [
          ...prev,
          {
            id: `${rowNumber}-${seatNumber}`,
            rowNumber,
            seatNumber,
            ticketType: TicketType.NORMAL
          }
        ];
      }
    });
  }

  function onChangeTicketType(id: string, newTicketType: TicketType) {
    setSelectedSeats((prev) => {
      const seat = prev.find((seat) => seat.id === id);
      if (!seat) {
        return prev;
      }
      return prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            ticketType: newTicketType
          };
        }
        return s;
      });
    });
  }

  function onChangeStep(step: Step) {
    setCurrentStep(step);
  }

  function onDeleteTicket(id: string) {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== id));
  }

  if (currentStep === "select-seats") {
    return (
      <SelectSeats
        showtime={showtime}
        selectedSeats={selectedSeats}
        onSeatClick={onSeatClick}
        onChangeStep={onChangeStep}
      />
    );
  }

  if (currentStep === "select-tickets") {
    return (
      <SelectTickets
        tickets={tickets}
        selectedSeats={selectedSeats}
        onChangeTicketType={onChangeTicketType}
        onChangeStep={onChangeStep}
        onDeleteTicket={onDeleteTicket}
      />
    );
  }

  if (currentStep === "summary") {
    return (
      <Summary
        showtime={showtime}
        tickets={tickets}
        selectedSeats={selectedSeats}
        onChangeStep={onChangeStep}
      />
    );
  }
}
