import Wrapper from "@/app/(staff)/staff/dashboard/(main)/Wrapper";
import EmployeeList from "@/app/(staff)/staff/dashboard/(main)/employees/EmployeeList";

export default async function EmployeesPage() {
  return (
    <Wrapper>
      <h1 className="mb-8 text-3xl font-bold">Pracownicy</h1>
      <EmployeeList />
    </Wrapper>
  );
}
