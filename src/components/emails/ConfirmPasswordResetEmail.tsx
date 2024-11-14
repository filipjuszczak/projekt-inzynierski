interface ConfirmPasswordResetEmailProps {
  firstName: string;
  link: string;
}

export default function ConfirmPasswordResetEmail({
  firstName,
  link
}: ConfirmPasswordResetEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>Twoje hasło zostało pomyślnie zresetowane.</p>
      <p>
        Zaloguj się na <a href={link}>{link}</a>.
      </p>
    </div>
  );
}
