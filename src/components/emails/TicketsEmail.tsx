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
            Numer sali: <strong>{showtime.room}</strong>
          </li>
          <li>
            Data:{" "}
            <strong>{format(showtime.startTime, "dd.MM.yyyy HH:mm")}</strong>
          </li>
          <li>
            Bilety:
            <ul>
              {seats.map((seat) => (
                <li key={seat.id}>
                  Rząd: <strong>{seat.rowNumber}</strong>, Miejsce:{" "}
                  <strong>{seat.seatNumber}</strong>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
