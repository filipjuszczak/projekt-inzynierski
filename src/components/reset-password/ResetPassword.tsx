import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import SetNewPasswordForm from "@/components/reset-password/SetNewPasswordForm";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm";

interface ResetProps {
  token: string;
}

export default function ResetPassword({ token }: ResetProps) {
  return (
    <div className="max-w-md">
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {token ? "Ustaw nowe hasło" : "Zresetuj hasło"}
          </CardTitle>
          <CardDescription>
            {token
              ? "Ustaw nowe hasło, aby odzyskać dostęp do swojego konta."
              : "Wpisz adres e-mail, aby wysłać prośbę o zresetowanie hasła. Link resetujący hasło wyślemy na Twoją pocztę e-mail."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {token ? <SetNewPasswordForm token={token} /> : <ResetPasswordForm />}
        </CardContent>
      </Card>
    </div>
  );
}
