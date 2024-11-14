import EmployeeForm from "@/app/(staff)/staff/dashboard/(main)/employees/EmployeeForm";

export default function NewEmployeePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-2xl">New Employee</h1>
        <EmployeeForm />
      </div>
    </div>
  );
}
