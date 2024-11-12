import { useMutation } from "@tanstack/react-query";

export const useActivateAccountMutation = (token: string | null) => {
  return useMutation({
    mutationKey: ["activateAccount", token],
    mutationFn: async () => {
      const response = await fetch("/api/activate-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error);
        error.message = errorData.error;
        throw error;
      }

      return await response.json();
    },
    retry: false
  });
};

export const useGenerateNewTokenMutation = (
  email: string | null,
  token: string | null
) => {
  return useMutation({
    mutationKey: ["generate-new-token", email],
    mutationFn: async () => {
      const response = await fetch("/api/generate-new-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error);
        error.message = errorData.error;
        throw error;
      }

      return await response.json();
    },
    retry: false
  });
};
