import { redirect } from "next/navigation";
import { authEmployee } from "@/app/(staff)/staff/auth";

export default async function Layout({ children }: React.PropsWithChildren) {
  const { session } = await authEmployee();
  if (session) {
    return redirect("/staff/dashboard");
  }

  return children;
}
