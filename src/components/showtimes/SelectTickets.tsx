import {
  CircleX,
  MoveLeft,
  MoveRight,
  Ticket as TicketIcon
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger
} from "@/components/ui/select";
import { TICKET_LABELS } from "@/lib/constants";
import type { Ticket, TicketType } from "@prisma/client";
import type { SelectedSeat, Step } from "@/lib/types";

interface SelectTicketsProps {
  tickets: Record<
    string,
    {
      price: number;
    }
  >;
  selectedSeats: SelectedSeat[];
  onChangeTicketType: (id: string, newTicketType: TicketType) => void;
  onChangeStep: (step: Step) => void;
  onDeleteTicket: (id: string, rowNumber: number, seatNumber: number) => void;
}

export default function SelectTickets({
  tickets,
  selectedSeats,
  onChangeTicketType,
  onChangeStep,
  onDeleteTicket
}: SelectTicketsProps) {
  const totalPrice =
    selectedSeats.reduce(
      (acc, seat) => acc + tickets[seat.ticketType].price,
      0
    ) / 100;

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader className="text-3xl font-bold">Wybierz bilety</CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-2">
            {selectedSeats.map((seat) => (
              <Ticket
                key={`ticket-${seat.rowNumber}-${seat.seatNumber}`}
                tickets={tickets}
                rowNumber={seat.rowNumber}
                seatNumber={seat.seatNumber}
                type={seat.ticketType}
                onChangeTicketType={onChangeTicketType}
                onDelete={() =>
                  onDeleteTicket(
                    `${seat.rowNumber}-${seat.seatNumber}`,
                    seat.rowNumber,
                    seat.seatNumber
                  )
                }
              />
            ))}
          </div>
          <div className="text-xl font-bold">Łącznie: {totalPrice} PLN</div>
          <div className="flex justify-between">
            <Button onClick={() => onChangeStep("select-seats")}>
              <MoveLeft />
              Wróć
            </Button>
            <Button
              onClick={() => onChangeStep("summary")}
              disabled={selectedSeats.length === 0}
            >
              Dalej
              <MoveRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TicketProps {
  tickets: Record<
    string,
    {
      price: number;
    }
  >;
  type: TicketType;
  rowNumber: number;
  seatNumber: number;
  onChangeTicketType: (id: string, newTicketType: TicketType) => void;
  onDelete: () => void;
}

function Ticket({
  tickets,
  type,
  rowNumber,
  seatNumber,
  onChangeTicketType,
  onDelete
}: TicketProps) {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex justify-between pt-6">
          <div>
            <div className="flex flex-col gap-2 text-lg">
              <TicketIcon className="text-muted-foreground" />{" "}
              <div>
                {TICKET_LABELS[type]} -{" "}
                <span className="text-sm text-muted-foreground">
                  {tickets[type].price / 100} PLN
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Rząd: {rowNumber}; Miejsce: {seatNumber}
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <CircleX className="size-10" />
            <span className="sr-only">Usuń bilet</span>
          </Button>
        </div>
        <Select
          value={type}
          onValueChange={(value: TicketType) =>
            onChangeTicketType(`${rowNumber}-${seatNumber}`, value)
          }
        >
          <SelectTrigger className="w-[180px]">
            Zmień rodzaj biletu
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(tickets).map(([ticketType, { price }]) => (
                <SelectItem key={ticketType} value={ticketType}>
                  <SelectLabel>
                    {TICKET_LABELS[ticketType as TicketType]} - {price / 100}{" "}
                    PLN
                  </SelectLabel>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
