import { useAxios } from "@/hooks/useAxios";
import { AuthQueryKeys } from "../types";
import { useQuery } from "@tanstack/react-query";
import { UserWithComputedFields } from "@/modules/user/types";
import { useEffect } from "react";

export function useGetme() {
  const { apiBase } = useAxios();
  const {
    isSuccess: fetchedSuccessfully,
    error: meError,
    refetch,
  } = useQuery({
    queryFn: () =>
      apiBase.get<UserWithComputedFields>("/me").then((res) => res.data),
    queryKey: [AuthQueryKeys.ME],
    gcTime: Infinity,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    fetchedSuccessfully,
    meError,
  };
}
