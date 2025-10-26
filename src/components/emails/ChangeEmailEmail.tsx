interface ChangeEmailEmail {
  firstName: string;
  link: string;
}

export default function ChangeEmailEmail({
  firstName,
  link
}: ChangeEmailEmail) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>Aby potwierdzić zmianę adresu e-mail, kliknij w poniższy link:</p>
      <p>
        <a href={link}>{link}</a>.
      </p>
    </div>
  );
}
