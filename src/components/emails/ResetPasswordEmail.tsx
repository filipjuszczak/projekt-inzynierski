interface ResetPasswordEmailProps {
  firstName: string;
  link: string;
}

export default function ResetPasswordEmail({
  firstName,
  link
}: ResetPasswordEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>
        Otrzymujesz tę wiadomość, ponieważ otrzymaliśmy prośbę o zresetowanie
        hasła do Twojego konta.
      </p>
      <p>
        Aby zresetować swoje hasło, kliknij w ten link:{" "}
        <a href={link}>{link}</a> (link wygaśnie za 15 minut).
      </p>
      <p>
        Jeśli nie prosiłeś o zresetowanie hasła, zignoruj tę wiadomość, a Twoje
        hasło pozostanie bez zmian.
      </p>
    </div>
  );
}
