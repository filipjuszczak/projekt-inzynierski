interface AccountActivationConfirmationEmailProps {
  firstName: string;
}

export default function AccountActivationConfirmationEmail({
  firstName
}: AccountActivationConfirmationEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>Twoje konto zostało pomyślnie aktywowane!</p>
    </div>
  );
}
