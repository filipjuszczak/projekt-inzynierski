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
import LogoutButton from "@/components/LogoutButton";
import ThemeChanger from "@/components/dashboard/ThemeChanger";
import ChangeFeaturedMovie from "@/components/dashboard/ChangeFeaturedMovie";

interface EmployeeMenuProps {
  movies:
    | {
        id: string;
        title: string;
        isFeatured: boolean;
      }[]
    | null;
}

export default function EmployeeMenu({ movies }: EmployeeMenuProps) {
  const user = useUserStore(
    useShallow((state) => ({
      username: state.username,
      firstName: state.firstName,
      lastName: state.lastName
    }))
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem className="mb-8">
        <ChangeFeaturedMovie movies={movies} />
      </SidebarMenuItem>
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
            <LogoutButton redirectTo="/panel-pracownika/logowanie" asMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
