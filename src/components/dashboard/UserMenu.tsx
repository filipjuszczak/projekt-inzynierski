import { useShallow } from "zustand/react/shallow";
import { User2, ChevronUp } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/hooks/use-user-store";
import ChangePasswordButton from "@/components/dashboard/ChangePasswordButton";
import LogOutButton from "@/components/dashboard/LogOutButton";
import ThemeChanger from "@/components/dashboard/ThemeChanger";

export default function UserMenu() {
  const user = useUserStore(
    useShallow((state) => ({
      username: state.username,
      firstName: state.firstName,
      lastName: state.lastName
    }))
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User2 />{" "}
              {user.username
                ? user.username
                : `${user.firstName} ${user.lastName}`}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <ThemeChanger />
            <ChangePasswordButton />
            <LogOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
