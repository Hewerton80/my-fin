import { UserWithComputedFields } from "@/modules/user/types";
import {
  MutationCache,
  QueryCache,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { AuthQueryKeys } from "../types";
import { queryClient } from "@/lib/queryClient";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/stores/useAuthStore";

export function useGetLoggedUser() {
  const { loggedUser, setContextLoggedUser } = useAuthStore(
    useShallow((state) => state)
  );

  return { loggedUser, setContextLoggedUser };
}
