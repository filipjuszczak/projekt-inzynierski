"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ky from "ky";
import { toast } from "sonner";
import { TicketType } from "@prisma/client";
import SelectTickets from "@/components/showtimes/SelectTickets";
import SelectSeats from "@/components/showtimes/SelectSeats";
import Summary from "@/components/showtimes/Summary";
import { GENERIC_ERROR_MESSAGE, MAX_SELECTED_SEATS } from "@/lib/constants";
import type { SelectedSeat, Step } from "@/lib/types";

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
    seatReservations: {
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

export default function OrderTickets({ showtime, tickets }: OrderTicketsProps) {
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState<Step>("select-seats");
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  const isUserBuying = useRef(false);
  const selectedSeatsRef = useRef(selectedSeats);

  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) return;

    const selectedSeatsParams = searchParams.getAll("seat");
    if (selectedSeatsParams.length === 0) return;

    async function unlockSelectedSeats() {
      await ky.post("/api/seats/unlock-selected", {
        json: {
          seats: selectedSeatsParams.map((seat) => {
            const [rowNumber, seatNumber] = seat.split("-");
            return { rowNumber, seatNumber };
          })
        }
      });
    }

    unlockSelectedSeats();
  }, [searchParams]);

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    function onBeforeUnload() {
      if (isUserBuying.current || selectedSeatsRef.current.length === 0) {
        return;
      }

      const baseUrl = window.location.origin;
      navigator.sendBeacon(
        `${baseUrl}/api/seats/unlock-selected`,
        JSON.stringify({
          showtimeId: showtime.id,
          seats: selectedSeatsRef.current.map((seat) => ({
            rowNumber: seat.rowNumber,
            seatNumber: seat.seatNumber
          }))
        })
      );
    }

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      onBeforeUnload();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
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

  async function onDeleteTicket(
    id: string,
    rowNumber: number,
    seatNumber: number
  ) {
    try {
      const apiEndpoint = `/api/seats/unlock`;
      const { success } = await ky
        .post(apiEndpoint, {
          json: { showtimeId: showtime.id, rowNumber, seatNumber }
        })
        .json<{ success: boolean }>();

      if (success) {
        setSelectedSeats((prev) => prev.filter((s) => s.id !== id));
        setCurrentStep("select-seats");
      } else {
        toast.error(
          "To miejsce zostało zarezerwowane przez innego użytkownika."
        );
      }
    } catch (error) {
      toast.error(GENERIC_ERROR_MESSAGE);
    }
  }

  function onCheckoutStart() {
    isUserBuying.current = true;
  }

  function onCheckoutCancel() {
    isUserBuying.current = false;
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
        onCheckoutStart={onCheckoutStart}
        onCheckoutCancel={onCheckoutCancel}
      />
    );
  }
}
