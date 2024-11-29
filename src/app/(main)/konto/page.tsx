import { Suspense } from "react";
import AccountOverview from "@/components/account/AccountOverview";
import AccountSettings from "@/components/account/AccountSettings";
import PersonalInfo from "@/components/account/PersonalInfo";
import RecentActivity from "@/components/account/RecentActivity";
import AccountOverviewSkeleton from "@/components/account/skeletons/AccountOverviewSkeleton";
import AccountSettingsSkeleton from "@/components/account/skeletons/AccountSettingsSkeleton";
import PersonalInfoSkeleton from "@/components/account/skeletons/PersonalInfoSkeleton";
import RecentActivitySkeleton from "@/components/account/skeletons/RecentActivitySkeleton";

export default function AccountPage() {
  return (
    <main className="container mx-auto flex-grow py-10">
      <div className="mx-4">
        <h1 className="mb-8 text-4xl font-bold">Moje konto</h1>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <Suspense fallback={<AccountOverviewSkeleton />}>
              <AccountOverview />
            </Suspense>
            <Suspense fallback={<PersonalInfoSkeleton />}>
              <PersonalInfo />
            </Suspense>
          </div>
          <div className="space-y-8">
            <Suspense fallback={<RecentActivitySkeleton />}>
              <RecentActivity />
            </Suspense>
            <Suspense fallback={<AccountSettingsSkeleton />}>
              <AccountSettings />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
