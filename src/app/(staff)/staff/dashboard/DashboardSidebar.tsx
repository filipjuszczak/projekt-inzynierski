"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Home,
  ChartColumnStacked,
  FilePlus,
  Clapperboard,
  Armchair,
  Popcorn,
  BookOpen,
  User2,
  ChevronUp
} from "lucide-react";
import { logOut } from "@/app/(staff)/staff/actions";
import { useUserStore } from "@/hooks/use-user-store";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    url: "/staff/dashboard",
    icon: Home
  },
  {
    title: "Genres",
    url: "/staff/dashboard/genres",
    icon: ChartColumnStacked,
    children: [
      {
        title: "Create new",
        url: "/staff/dashboard/genres/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Movies",
    url: "/staff/dashboard/movies",
    icon: Clapperboard,
    children: [
      {
        title: "Create new",
        url: "/staff/dashboard/movies/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Rooms",
    url: "/staff/dashboard/rooms",
    icon: Armchair,
    children: [
      {
        title: "Create new",
        url: "/staff/dashboard/rooms/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Showtimes",
    url: "/staff/dashboard/showtimes",
    icon: Popcorn,
    children: [
      {
        title: "Create new",
        url: "/staff/dashboard/showtimes/new",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Orders",
    url: "/staff/dashboard/orders",
    icon: BookOpen
  }
];

export default function DashboardSidebar() {
  const userStore = useUserStore(
    useShallow((state) => ({
      firstName: state.firstName,
      lastName: state.lastName,
      username: state.username,
      email: state.email,
      resetStore: state.resetUserData
    }))
  );

  const queryClient = useQueryClient();
  const { toast } = useToast();

  async function handleLogout() {
    queryClient.clear();
    const result = await logOut();
    if ("error" in result) {
      toast({
        variant: "destructive",
        description: result.error
      });
      return;
    }

    userStore.resetStore();
    redirect("/staff/login");
  }

  return (
    <Sidebar>
      <SidebarHeader>Cinema</SidebarHeader>
      <SidebarContent>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item?.children?.map((child) => (
                  <SidebarMenuSub key={`${item.title}-${child.title}`}>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild>
                        <Link href={child.url}>
                          <child.icon />
                          <span>{child.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                ))}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
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
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
