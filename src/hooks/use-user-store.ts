import { useContext } from "react";
import { useStore } from "zustand";
import { UserStoreContext } from "@/components/UserStoreProvider";
import type { UserStore } from "@/lib/store";

export const useUserStore = <T>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
