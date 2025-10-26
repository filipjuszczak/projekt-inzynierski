import { useQuery } from "@tanstack/react-query";
import { GENERIC_ERROR_MESSAGE } from "@/lib/constants";
import { UserActivity } from "@/lib/types";

export const useUserActivities = () => {
  return useQuery({
    queryKey: ["userActivities"],
    queryFn: async (): Promise<UserActivity[]> => {
      const response = await fetch("/api/user-activities");
      if (!response.ok) throw new Error(GENERIC_ERROR_MESSAGE);
      return response.json();
    },
    staleTime: Infinity
  });
};
