interface EmployeeUserCreationEmailProps {
  firstName: string;
  username?: string;
  email: string;
  password: string;
  link: string;
}

export default function EmployeeUserCreationEmail({
  firstName,
  username,
  email,
  password,
  link
}: EmployeeUserCreationEmailProps) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>Miło nam jest powitać Cię w naszym zespole!</p>
      <p>
        Aby zalogować się do naszego systemu, użyj swojej nazwy użytkownika
        (jeśli została Ci nadana) lub adresu e-mail oraz wygenerowanego hasła,
        które znajduje się poniżej.
      </p>
      <p>
        Link do strony logowania: <a href={link}>{link}</a>.
      </p>
      <p>
        {username ? `Nazwa użytkownika: ${username}` : `Adres-email: ${email}`}
      </p>
      <p>Hasło: {password}</p>
      <p>Po pierwszym logowaniu zostaniesz poproszony o zmianę hasła.</p>
    </div>
  );
}
