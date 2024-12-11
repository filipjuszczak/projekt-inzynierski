"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ZoomButtons from "@/components/showtimes/ZoomButtons";
import Screen from "@/components/showtimes/Screen";
import Seats from "@/components/showtimes/Seats";
import Legend from "@/components/showtimes/Legend";
import type { BookedSeat, SelectedSeat, Step } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

interface RoomProps {
  showtimeId?: string;
  numberOfRows: number;
  seatsPerRow: number;
  bookedSeats?: BookedSeat[];
  selectedSeats?: SelectedSeat[];
  onSeatClick?: (rowNumber: number, seatNumber: number) => void;
  onChangeStep?: (step: Step) => void;
}

export default function Room({
  showtimeId,
  numberOfRows,
  seatsPerRow,
  bookedSeats,
  selectedSeats,
  onSeatClick,
  onChangeStep
}: RoomProps) {
  const [scale, setScale] = useState(1);

  function handleZoom(direction: "in" | "out") {
    setScale((prevScale) => {
      const newScale = direction === "in" ? prevScale * 1.2 : prevScale / 1.2;
      return Math.min(Math.max(newScale, 0.5), 2);
    });
  }

  return (
    <div className="mx-auto w-full max-w-full space-y-4 p-2 sm:max-w-4xl sm:p-4">
      <ZoomButtons onZoom={handleZoom} />
      <div className="relative overflow-auto rounded-lg border bg-background p-4 shadow-inner sm:p-8">
        <motion.div
          className="flex min-h-[300px] w-full origin-top-left flex-col items-center rounded-lg sm:min-h-[400px]"
          style={{ scale }}
        >
          <Screen />
          <Seats
            showtimeId={showtimeId}
            numberOfRows={numberOfRows}
            seatsPerRow={seatsPerRow}
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onSeatClick={onSeatClick}
          />
        </motion.div>
      </div>
      <Legend
        showFree
        showSelected={!!selectedSeats}
        showBooked={!!bookedSeats}
      />
      {onChangeStep && selectedSeats && (
        <div className="flex justify-end">
          <Button
            onClick={() => onChangeStep("select-tickets")}
            disabled={selectedSeats.length === 0}
          >
            Dalej
            <MoveRight />
          </Button>
        </div>
      )}
    </div>
  );
}
