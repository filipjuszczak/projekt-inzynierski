import { cn } from "@/lib/utils";

interface SeatProps {
  rowNumber: number | null;
  seatNumber: number | null;
  isBooked: boolean;
  isSelected?: boolean;
}

export default function Seat({ seatNumber, isBooked, isSelected }: SeatProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-sm bg-foreground font-mono text-xs text-background",
        isBooked && "bg-muted text-white",
        isSelected && "bg-primary text-white"
      )}
    >
      {seatNumber}
    </div>
  );
}
