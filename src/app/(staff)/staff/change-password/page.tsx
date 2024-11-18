import ChangePasswordForm from "@/components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Ustaw nowe hasło</h1>
        <ChangePasswordForm />
      </div>
    </main>
  );
}
