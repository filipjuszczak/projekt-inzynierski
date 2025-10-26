interface EmployeeUserCreationEmailProps {
  name: string;
  email: string;
  password: string;
  link: string;
}

export default function EmployeeUserCreationEmail({
  name,
  email,
  password,
  link
}: EmployeeUserCreationEmailProps) {
  return (
    <div>
      <h1>Witaj, {name}!</h1>
      <p>Miło nam jest powitać Cię w naszym zespole!</p>
      <p>
        Aby zalogować się do naszego systemu, użyj adresu e-mail oraz
        wygenerowanego hasła, które znajduje się poniżej.
      </p>
      <p>
        Link do strony logowania: <a href={link}>{link}</a>.
      </p>
      <p>Adres-email: {email}</p>
      <p>Hasło: {password}</p>
      <p>Po pierwszym logowaniu zostaniesz poproszony o zmianę hasła.</p>
    </div>
  );
}
