interface ReservationDeletedEmailProps {
  firstName: string;
  orderId: string;
}

export default function ReservationDeletedEmail({
  firstName,
  orderId
}: ReservationDeletedEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>
        Twoja rezerwacja numer {orderId} została anulowana. Jeśli uważasz, że to
        pomyłka, skontaktuj się z działem obsługi klienta.
      </p>
    </div>
  );
}
