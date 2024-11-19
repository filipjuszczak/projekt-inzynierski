"use client";

import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import {
  Home,
  ChartColumnStacked,
  FilePlus,
  Armchair,
  Popcorn,
  BookOpen,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import AdminSidebarSection from "@/components/dashboard/AdminSidebarSection";
import UserMenu from "@/components/dashboard/UserMenu";
import { useUserStore } from "@/hooks/use-user-store";

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

export default function DashboardSidebar() {
  const user = useUserStore(
    useShallow((state) => ({
      username: state.username,
      firstName: state.firstName,
      lastName: state.lastName
    }))
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2">
          <Film className="h-6 w-6" />
          CinemaPlus
        </div>
      </SidebarHeader>
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
                            {item.children.map((child) => (
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
        <AdminSidebarSection />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
