"use client";

import Link from "next/link";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { UserType } from "@prisma/client";
import { useFetchEmployees } from "@/app/(staff)/staff/dashboard/(main)/employees/queries";

export default function EmployeeList() {
  const { data: employeesData, isFetching } = useFetchEmployees();

  return (
    <div>
      {isFetching && <Loader />}
      {employeesData && employeesData.length === 0 && <NotFound />}
      {employeesData && employeesData.length > 0 && (
        <EmployeeTable employees={employeesData} />
      )}
    </div>
  );
}

interface EmployeeTableProps {
  employees: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    userType: string;
  }[];
}

const userTypeLabels = {
  [UserType.ADMIN]: "Administrator",
  [UserType.EMPLOYEE]: "Pracownik"
};

function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Nazwa użytkownika</TableHead>
          <TableHead>Imię</TableHead>
          <TableHead>Nazwisko</TableHead>
          <TableHead>Adres e-mail</TableHead>
          <TableHead>Data urodzenia</TableHead>
          <TableHead>Typ konta</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>{employee.id}</TableCell>
            <TableCell>{employee.username}</TableCell>
            <TableCell>{employee.firstName}</TableCell>
            <TableCell>{employee.lastName}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>
              {format(new Date(employee.dateOfBirth), "dd.MM.yyyy")}
            </TableCell>
            <TableCell>
              {userTypeLabels[employee.userType as keyof typeof userTypeLabels]}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/staff/dashboard/employees/${employee.id}/edit`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
