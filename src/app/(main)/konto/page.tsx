import AccountOverview from "@/components/account/AccountOverview";
import AccountSettings from "@/components/account/AccountSettings";
import PersonalInfo from "@/components/account/PersonalInfo";
import RecentActivity from "@/components/account/RecentActivity";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moje konto",
  description:
    "Zarządzaj swoim kontem, przeglądaj i anuluj rezerwacje, zmieniaj ustawienia konta.",
  openGraph: {
    title: "Moje konto | Sunema",
    description:
      "Zarządzaj swoim kontem, przeglądaj i anuluj rezerwacje, zmieniaj ustawienia konta."
  }
};

export default function AccountPage() {
  return (
    <main className="container mx-auto flex-grow py-10">
      <div className="mx-4">
        <h1 className="mb-8 text-4xl font-bold">Moje konto</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <AccountOverview />
            <PersonalInfo />
          </div>
          <div className="space-y-8">
            <RecentActivity />
            <AccountSettings />
          </div>
        </div>
      </div>
    </main>
  );
}
