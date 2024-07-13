import { UserWithComputedFields } from "@/modules/user/types";
import { create } from "zustand";

interface State {
  loggedUser: UserWithComputedFields | null;
}

interface Actions {
  setContextLoggedUser: (user: UserWithComputedFields | null) => void;
}

export const useAuthStore = create<State & Actions>((set) => ({
  loggedUser: null,
  setContextLoggedUser: (user: UserWithComputedFields | null) => {
    set({ loggedUser: user });
  },
}));
