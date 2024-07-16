import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/stores/useAuthStore";

export function useGetLoggedUser() {
  const { loggedUser, setContextLoggedUser } = useAuthStore(
    useShallow((state) => state)
  );

  return { loggedUser, setContextLoggedUser };
}
