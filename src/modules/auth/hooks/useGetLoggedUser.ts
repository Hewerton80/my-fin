import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { AuthQueryKeys } from "../types";
import { UserWithComputedFields } from "@/modules/user/types";

export function useGetLoggedUser() {
  const queryClient = useQueryClient();

  const loggedUser = useMemo(() => {
    const foundUser = queryClient.getQueryData<UserWithComputedFields>([
      AuthQueryKeys.ME,
    ]);
    return foundUser;
  }, [queryClient]);

  return { loggedUser };
}
