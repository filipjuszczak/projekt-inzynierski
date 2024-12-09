import { notFound } from "next/navigation";
import EmployeeForm from "@/components/dashboard/employees/EmployeeForm";
import { getEmployeeById } from "@/app/(staff)/panel-pracownika/pulpit/(management)/pracownicy/data";

interface EditEmployeePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEmployeePage({
  params
}: EditEmployeePageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Edytuj konto pracownika</h1>
      <EmployeeForm
        id={employee.id}
        role={employee.role!}
        username={employee.username || ""}
        firstName={employee.firstName}
        lastName={employee.lastName}
        email={employee.email}
        dateOfBirth={employee.dateOfBirth}
      />
    </div>
  );
}
