import { KeyRound } from "lucide-react";
import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ChangePasswordButton() {
  return (
    <DropdownMenuItem asChild>
      <div>
        <KeyRound />
        <Link href="/staff/change-password">Zmień hasło</Link>
      </div>
    </DropdownMenuItem>
  );
}
