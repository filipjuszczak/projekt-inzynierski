import { createStore } from "zustand/vanilla";
import { devtools, persist } from "zustand/middleware";

export type UserState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
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
  email: ""
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
