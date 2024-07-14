import { useAxios } from "@/hooks/useAxios";
import { AuthQueryKeys } from "../types";
import { useQuery } from "@tanstack/react-query";
import { UserWithComputedFields } from "@/modules/user/types";

export function useGetme() {
  const { apiBase } = useAxios();
  const { isSuccess: fetchedSuccessfully, error: meError } = useQuery({
    queryFn: () =>
      apiBase.get<UserWithComputedFields>("/me").then((res) => res.data),
    queryKey: [AuthQueryKeys.ME],
    gcTime: Infinity,
    enabled: true,
  });
  return {
    fetchedSuccessfully,
    meError,
  };
}
