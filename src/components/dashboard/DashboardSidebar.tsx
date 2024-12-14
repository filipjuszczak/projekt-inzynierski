"use client";

import Link from "next/link";
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
import EmployeeMenu from "@/components/dashboard/EmployeeMenu";

const menuItems = [
  {
    title: "Pulpit",
    url: "/panel-pracownika/pulpit",
    icon: Home
  },
  {
    title: "Gatunki filmowe",
    url: "/panel-pracownika/pulpit/gatunki",
    icon: ChartColumnStacked,
    children: [
      {
        title: "Lista",
        url: "/panel-pracownika/pulpit/gatunki",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/panel-pracownika/pulpit/gatunki/nowy",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Filmy",
    url: "/panel-pracownika/pulpit/filmy",
    icon: Film,
    children: [
      {
        title: "Lista",
        url: "/panel-pracownika/pulpit/filmy",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/panel-pracownika/pulpit/filmy/nowy",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Sale",
    url: "/panel-pracownika/pulpit/sale",
    icon: Armchair,
    children: [
      {
        title: "Lista",
        url: "/panel-pracownika/pulpit/sale",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/panel-pracownika/pulpit/sale/nowy",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Seanse",
    url: "/panel-pracownika/pulpit/seanse",
    icon: Popcorn,
    children: [
      {
        title: "Lista",
        url: "/panel-pracownika/pulpit/seanse",
        icon: List
      },
      {
        title: "Utwórz",
        url: "/panel-pracownika/pulpit/seanse/nowy",
        icon: FilePlus
      }
    ]
  },
  {
    title: "Rezerwacje",
    url: "/panel-pracownika/pulpit/rezerwacje",
    icon: BookOpen
  }
];

interface DashboardSidebarProps {
  movies:
    | {
        id: string;
        title: string;
        isFeatured: boolean;
      }[]
    | null;
}

export default function DashboardSidebar({ movies }: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div>
          <Link href="/" className="flex max-w-fit gap-2">
            <Film className="h-6 w-6" />
            Sunema
          </Link>
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
        <EmployeeMenu movies={movies} />
      </SidebarFooter>
    </Sidebar>
  );
}
