import { redirect } from "next/navigation";
import { authUser } from "@/auth";

export default async function AuthLayout({
  children
}: React.PropsWithChildren) {
  const session = await authUser();
  if (session.user) redirect("/");

  return children;
}
