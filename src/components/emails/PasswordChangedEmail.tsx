interface PasswordChangedEmailProps {
  firstName: string;
}

export default function PasswordChangedEmail({
  firstName
}: PasswordChangedEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>Twoje hasło zostało pomyślnie zmienione.</p>
      <p>Jeśli to nieautoryzowana akcja - skontaktuj się z działem wsparcia.</p>
    </div>
  );
}
