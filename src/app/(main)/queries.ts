import { useQuery } from "@tanstack/react-query";
import ky from "ky";

interface CheckAuthResponse {
  isAuthenticated: boolean;
}

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["authentication"],
    queryFn: () =>
      ky.get("/api/auth/user/check-session").json<CheckAuthResponse>(),
    staleTime: Infinity
  });
};
