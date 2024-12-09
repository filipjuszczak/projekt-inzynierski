import { format } from "date-fns";

interface TicketsEmailProps {
  firstName: string;
  showtime: {
    startTime: Date;
    movie: string;
    room: string;
  };
  seats: {
    id: string;
    rowNumber: number;
    seatNumber: number;
  }[];
}

export default function TicketsEmail({
  firstName,
  showtime,
  seats
}: TicketsEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>
        Twoja rezerwacja została utworzona. Dziękujemy za skorzystanie z naszego
        serwisu.
      </p>
      <p>Oto szczegóły Twojej rezerwacji:</p>
      <div>
        <ul>
          <li>
            Film: <strong>{showtime.movie}</strong>
          </li>
          <li>
            Sala: <strong>{showtime.room}</strong>
          </li>
          <li>
            Data:{" "}
            <strong>{format(showtime.startTime, "dd.MM.yyyy HH:mm")}</strong>
          </li>
          <li>
            Miejsca:
            <ul>
              {seats.map((seat) => (
                <li key={seat.id}>
                  Rząd: {seat.rowNumber}; Miejsce: {seat.seatNumber}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
