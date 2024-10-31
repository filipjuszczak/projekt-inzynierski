import LoginForm from "@/app/(staff)/staff/login/LoginForm";

export default function DashboardLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-center text-2xl font-bold">Panel Pracownika</h1>
        <LoginForm />
      </div>
    </main>
  );
}
