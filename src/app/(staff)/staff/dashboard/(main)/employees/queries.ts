import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { Employee } from "@/lib/types";

export const useFetchEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => ky.get("/api/employees").json<Employee[]>()
  });
};

export const useFetchEmployeeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => ky.get(`/api/employees/${id}`).json<Employee>(),
    enabled: !!id
  });
};
