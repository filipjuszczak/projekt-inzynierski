"use client";

import Link from "next/link";
import { ChevronDown, FilePlus, List, User2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
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
import { useUserStore } from "@/hooks/use-user-store";
import { useShallow } from "zustand/react/shallow";
import { Role } from "@prisma/client";

const employeesMenuItems = [
  {
    title: "Pracownicy",
    url: "/panel-pracownika/pulpit/pracownicy",
    icon: User2,
    children: [
      {
        title: "Lista",
        url: "/panel-pracownika/pulpit/pracownicy",
        icon: List
      },
      {
        title: "Dodaj",
        url: "/panel-pracownika/pulpit/pracownicy/nowy",
        icon: FilePlus
      }
    ]
  }
];

export default function AdminSidebarSection() {
  const role = useUserStore(useShallow((state) => state.role));

  if (role !== Role.ADMIN) return null;

  return (
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
  );
}
