import { redirect } from "next/navigation";
import { authAdmin } from "@/app/(staff)/staff/auth";
import type { PropsWithChildren } from "react";

export default async function EmployeeLayout({ children }: PropsWithChildren) {
  const { session } = await authAdmin();
  if (!session) redirect("/staff/dashboard");

  return <>{children}</>;
}
