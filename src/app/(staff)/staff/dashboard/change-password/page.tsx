import ChangePasswordForm from "@/app/(staff)/staff/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl">Ustaw nowe hasło</h1>
        <ChangePasswordForm />
      </div>
    </main>
  );
}
