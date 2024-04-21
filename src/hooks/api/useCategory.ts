import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../utils/useAxios";
import { CategoryWitchComputedFields } from "@/types/Category";

export function useGetCategories() {
  const { apiBase } = useAxios();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiBase
        .get<CategoryWitchComputedFields[]>("/categories")
        .then((res) => res.data || { docs: [] }),
    enabled: false,
  });
  return {
    categories,
    isLoadingCategories,
    categoriesError,
    refetchCategories,
  };
}
