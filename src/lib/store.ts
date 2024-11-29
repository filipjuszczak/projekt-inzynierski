import { createStore } from "zustand/vanilla";
import { devtools, persist } from "zustand/middleware";
import { Role } from "@prisma/client";

export type UserState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role | null;
};

export type UserActions = {
  setUserData: (data: UserState) => void;
  resetUserData: () => void;
};

export type UserStore = UserState & UserActions;

export const defaultState: UserState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  role: null
};

export const createUserStore = (initialState: UserState = defaultState) => {
  return createStore<UserStore>()(
    devtools(
      persist(
        (set) => ({
          ...initialState,
          setUserData: (data: UserState) =>
            set((state) => ({
              ...state,
              ...data
            })),
          resetUserData: () => set(defaultState)
        }),
        { name: "user-data" }
      )
    )
  );
};
