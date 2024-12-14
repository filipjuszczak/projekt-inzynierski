import EmployeeForm from "@/components/dashboard/employees/EmployeeForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utwórz konto dla pracownika"
};

export default function NewEmployeePage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Utwórz konto dla pracownika</h1>
      <EmployeeForm />
    </div>
  );
}
