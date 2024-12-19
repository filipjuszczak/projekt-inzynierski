import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { AccountData } from "@/lib/types";

export const useAccountData = () => {
  return useQuery({
    queryKey: ["accountData"],
    queryFn: () => ky.get("/api/account").json<AccountData>(),
    staleTime: Infinity
  });
};
