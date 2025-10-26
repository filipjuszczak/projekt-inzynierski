import Link from "next/link";
import { BookOpen, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/LogoutButton";
import ThemeChanger from "@/components/dashboard/ThemeChanger";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer items-center justify-center border bg-background">
          <User />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/konto" className="cursor-pointer">
            <User className="size-4" />
            <span>Moje konto</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/konto/rezerwacje" className="cursor-pointer">
            <BookOpen className="size-4" />
            <span>Moje rezerwacje</span>
          </Link>
        </DropdownMenuItem>
        <ThemeChanger />
        <LogoutButton redirectTo="/" asMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
