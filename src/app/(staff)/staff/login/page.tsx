import LoginForm from "@/app/(staff)/staff/login/LoginForm";

export default function DashboardLoginPage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div>
        <h1 className="pb-8 text-center text-3xl font-bold">
          Panel Pracownika
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
