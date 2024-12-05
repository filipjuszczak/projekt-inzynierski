import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeesTable from "@/components/dashboard/employees/EmployeesTable";
import { getEmployees } from "@/app/(staff)/panel-pracownika/pulpit/(management)/pracownicy/data";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="flex-grow space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Pracownicy</h1>
        <Button asChild>
          <Link href="/panel-pracownika/pulpit/pracownicy/nowy">
            <PlusCircle />
            Nowy
          </Link>
        </Button>
      </div>
      <EmployeesTable data={employees} />
    </div>
  );
}
