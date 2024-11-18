import EmployeeTable from "@/components/dashboard/employees/EmployeesTable";
import type { Employee } from "@/lib/types";

interface EmployeeListProps {
  employees: Employee[];
}

export default function EmployeeList({ employees }: EmployeeListProps) {
  return <EmployeeTable employees={employees} />;
}
