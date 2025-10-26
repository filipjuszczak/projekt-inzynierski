interface UserDeletedEmail {
  firstName: string;
  link: string;
}

export default function UserDeletedEmail({
  firstName,
  link
}: UserDeletedEmail) {
  return (
    <div>
      <h1>Witaj, {firstName}!</h1>
      <p>Aby potwierdzić usunięcie konta, kliknij w poniższy link:</p>
      <p>
        <a href={link}>{link}</a>.
      </p>
    </div>
  );
}
