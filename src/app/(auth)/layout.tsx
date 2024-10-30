import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";
import type { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await validateRequest();
  if (session.user) redirect("/");

  return <div>{children}</div>;
}
