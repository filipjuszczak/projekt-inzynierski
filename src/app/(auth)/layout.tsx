import { redirect } from "next/navigation";
import { authUser } from "@/auth";
import type { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await authUser();
  if (session.user) redirect("/");

  return <div>{children}</div>;
}
