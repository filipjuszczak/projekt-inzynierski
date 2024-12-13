import { KeyRound } from "lucide-react";
import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ChangePasswordButton() {
  return (
    <DropdownMenuItem asChild>
      <Link
        href="/panel-pracownika/pulpit/zmien-haslo"
        className="cursor-pointer"
      >
        {" "}
        <KeyRound />
        Zmień hasło
      </Link>
    </DropdownMenuItem>
  );
}
