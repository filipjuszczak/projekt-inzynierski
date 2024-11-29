"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Role } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/lib/types";

interface EmployeeTableProps {
  employees: Employee[];
}

const roleLabels = {
  [Role.ADMIN]: "Administrator",
  [Role.EMPLOYEE]: "Pracownik"
};

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-96">ID</TableHead>
          <TableHead className="w-48">Nazwa użytkownika</TableHead>
          <TableHead>Imię</TableHead>
          <TableHead>Nazwisko</TableHead>
          <TableHead>Adres e-mail</TableHead>
          <TableHead>Data urodzenia</TableHead>
          <TableHead>Typ konta</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="w-96">{employee.id}</TableCell>
            <TableCell className="w-48">{employee.username}</TableCell>
            <TableCell>{employee.firstName}</TableCell>
            <TableCell>{employee.lastName}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>
              {format(new Date(employee.dateOfBirth), "dd.MM.yyyy")}
            </TableCell>
            <TableCell>
              {roleLabels[employee.role as keyof typeof roleLabels]}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Otwórz menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/panel-pracownika/pulpit/pracownicy/${employee.id}/edytuj`}
                    >
                      Edytuj
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
