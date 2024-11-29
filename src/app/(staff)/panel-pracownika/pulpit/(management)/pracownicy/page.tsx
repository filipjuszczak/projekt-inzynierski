import EmployeeList from "@/components/dashboard/employees/EmployeeList";
import { getEmployees } from "@/app/(staff)/panel-pracownika/pulpit/(management)/pracownicy/data";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Pracownicy</h1>
      <EmployeeList employees={employees} />
    </div>
  );
}
