import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../../hooks/useAxios";
import { CategoryWitchComputedFields } from "@/types/Category";
import { useMemo } from "react";

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

  const handleCategories = useMemo<
    CategoryWitchComputedFields[] | undefined
  >(() => {
    if (!categories) return undefined;
    return [...categories].map((category) => {
      return {
        ...category,
        subCategories:
          [...(category?.subCategories || [])]?.map((subCategory) => {
            return {
              ...subCategory,
              name: subCategory.iconName
                ? `${subCategory.iconName} ${subCategory.name}`
                : subCategory.name,
            };
          }) || [],
      };
    });
  }, [categories]);

  return {
    categories: handleCategories,
    isLoadingCategories,
    categoriesError,
    refetchCategories,
  };
}
