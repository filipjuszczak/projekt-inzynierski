interface AccountActivationEmailProps {
  firstName: string;
  link: string;
}

export default function AccountActivationEmail({
  firstName,
  link
}: AccountActivationEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>
        Aby aktywować konto, kliknij w link: <a href={link}>{link}</a> (link
        wygaśnie za 15 min.)
      </p>
    </div>
  );
}
