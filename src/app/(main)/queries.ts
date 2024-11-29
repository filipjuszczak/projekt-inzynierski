import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["authentication"],
    queryFn: () =>
      ky
        .get("/api/auth/user/check-session")
        .json<{ isAuthenticated: boolean }>()
  });
};
