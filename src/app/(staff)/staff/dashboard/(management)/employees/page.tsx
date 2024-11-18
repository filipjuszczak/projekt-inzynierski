import { notFound } from "next/navigation";
import EmployeeList from "@/components/dashboard/employees/EmployeeList";
import { getEmployees } from "@/app/(staff)/staff/dashboard/(management)/employees/data";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  if (!employees) {
    notFound();
  }

  return (
    <div className="flex-grow space-y-8">
      <h1 className="text-3xl font-bold">Pracownicy</h1>
      <EmployeeList employees={employees} />
    </div>
  );
}
