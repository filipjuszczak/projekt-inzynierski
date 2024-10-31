import { redirect } from "next/navigation";
import { authEmployee } from "@/app/(staff)/auth";
import type { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await authEmployee();
  if (!session.user) redirect("/staff/login");

  return <div>{children}</div>;
}
