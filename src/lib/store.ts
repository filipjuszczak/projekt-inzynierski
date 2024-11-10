import { createStore } from "zustand/vanilla";
import { devtools, persist } from "zustand/middleware";
import { UserType } from "@prisma/client";

export type UserState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  userType: UserType | null;
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
  userType: null
};

export const createUserStore = (initialState: UserState = defaultState) => {
  return createStore<UserStore>()(
    devtools(
      persist(
        (set) => ({
          ...initialState,
          setUserData: (data: UserState) => set(data),
          resetUserData: () => set(defaultState)
        }),
        { name: "zustand-store" }
      )
    )
  );
};
