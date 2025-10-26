import { Frown } from "lucide-react";
import ResetPassword from "@/components/reset-password/ResetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zresetuj hasło",
  description: "Zresetuj hasło do swojego konta.",
  openGraph: {
    title: "Zresetuj hasło | Sunema",
    description: "Zresetuj hasło do swojego konta."
  }
};

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-24 md:px-0">
      <ResetPassword token={token} />
    </main>
  );
}
