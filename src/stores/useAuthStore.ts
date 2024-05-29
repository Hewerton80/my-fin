import { UserWithComputedFields } from "@/modules/user/User";
import { create } from "zustand";

interface State {
  loggedUser: UserWithComputedFields | null;
}

interface Actions {
  setContextLoggedUser: (user: UserWithComputedFields | null) => void;
}

export const useAuthStore = create<State & Actions>((set) => ({
  loginError: null,
  isLoging: false,
  isLogged: false,
  loggedUser: null,
  setContextLoggedUser: (user: UserWithComputedFields | null) => {
    set({ loggedUser: user });
  },
}));
