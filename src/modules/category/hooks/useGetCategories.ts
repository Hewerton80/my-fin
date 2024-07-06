import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { CategoryWitchComputedFields, CategoryQueryKeys } from "../types";
import { useMemo } from "react";

export function useGetCategories() {
  const { apiBase } = useAxios();

  const {
    data: categories,
    isLoading,
    isFetching,
    refetch: refetchCategories,
    error: categoriesError,
  } = useQuery({
    queryFn: () =>
      apiBase
        .get<CategoryWitchComputedFields[]>("/me/categories")
        .then((res) => res.data),
    queryKey: [CategoryQueryKeys.LIST],
    gcTime: 1000 * 60 * 10,
    enabled: true,
  });

  const isLoadingCategories = useMemo(
    () => isLoading || isFetching,
    [isLoading, isFetching]
  );

  return {
    categories,
    isLoadingCategories,
    refetchCategories,
    categoriesError,
  };
}
