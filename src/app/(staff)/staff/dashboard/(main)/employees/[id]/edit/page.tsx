"use client";

import { useParams } from "next/navigation";
import EmployeeForm from "@/app/(staff)/staff/dashboard/(main)/employees/EmployeeForm";

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="flex items-center justify-center">
      <div className="space-y-4">
        <h1>Edit</h1>
        <EmployeeForm employeeId={params.id} />
      </div>
    </main>
  );
}
