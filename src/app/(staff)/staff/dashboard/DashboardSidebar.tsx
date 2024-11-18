"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import {
  Home,
  ChartColumnStacked,
  FilePlus,
  Armchair,
  Popcorn,
  BookOpen,
  User2,
  ChevronUp,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  List,
  Film
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { logOut } from "@/app/(staff)/staff/actions";
import { useUserStore } from "@/hooks/use-user-store";
import { UserType } from "@prisma/client";

const menuItems = [
  {
    title: "Panel główny",
    url: "/staff/dashboard",
    icon: Home
  },
  {
    title: "Gatunki filmowe",
    url: "/staff/dashboard/genres",
    icon: ChartColumnStacked,
    children: [
      {
        title: "Lista",
        url: "/staff/dashboard/genres",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/staff/dashboard/genres/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Filmy",
    url: "/staff/dashboard/movies",
    icon: Film,
    children: [
      {
        title: "Lista",
        url: "/staff/dashboard/movies",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/staff/dashboard/movies/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Sale",
    url: "/staff/dashboard/rooms",
    icon: Armchair,
    children: [
      {
        title: "Lista",
        url: "/staff/dashboard/rooms",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/staff/dashboard/rooms/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Seanse",
    url: "/staff/dashboard/showtimes",
    icon: Popcorn,
    children: [
      {
        title: "Lista",
        url: "/staff/dashboard/showtimes",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/staff/dashboard/showtimes/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Rezerwacje",
    url: "/staff/dashboard/orders",
    icon: BookOpen
  }
];

const employeesMenuItems = [
  {
    title: "Pracownicy",
    url: "/staff/dashboard/employees",
    icon: User2,
    children: [
      {
        title: "Lista",
        url: "/staff/dashboard/employees",
        icon: List
      },
      {
        title: "Dodaj",
        url: "/staff/dashboard/employees/new",
        icon: FilePlus
      }
    ]
  }
];

export default function DashboardSidebar() {
  const userStore = useUserStore(
    useShallow((state) => ({
      firstName: state.firstName,
      lastName: state.lastName,
      username: state.username,
      email: state.email,
      userType: state.userType,
      resetStore: state.resetUserData
    }))
  );
  const { setTheme } = useTheme();
  const queryClient = useQueryClient();

  async function handleLogout() {
    const result = await logOut();
    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    if ("success" in result && result.success) {
      queryClient.clear();
      userStore.resetStore();
      toast.success("Wylogowano pomyślnie!");
      return redirect("/staff/login");
    } else {
      toast.error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>Cinema</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Zarządzanie kinem</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.children) {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon />
                            {item.title}
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item?.children?.map((child) => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuButton asChild>
                                  <Link href={child.url}>
                                    <child.icon />
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {userStore.userType === UserType.ADMIN && (
          <SidebarGroup>
            <SidebarGroupLabel>Zarządzanie pracownikami</SidebarGroupLabel>
            <SidebarMenu>
              {employeesMenuItems.map((item) => {
                if (item.children) {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon />
                            {item.title}
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item?.children?.map((child) => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuButton asChild>
                                  <Link href={child.url}>
                                    <child.icon />
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />{" "}
                  {userStore.username
                    ? userStore.username
                    : `${userStore.firstName} ${userStore.lastName}`}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sun /> Zmień motyw
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun />
                      Jasny
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon />
                      Ciemny
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Monitor />
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem asChild>
                  <Link href="/staff/dashboard/change-password"></Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  <span>Wyloguj się</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
