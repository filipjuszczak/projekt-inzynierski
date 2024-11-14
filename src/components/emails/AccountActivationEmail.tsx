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
      <h1>Welcome to our cinema, {firstName}!</h1>
      <p>
        To activate your account, please click on the following link:{" "}
        <a href={link}>{link}</a> (it will expire in 15 minutes.)
      </p>
    </div>
  );
}
