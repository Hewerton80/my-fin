import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { useMemo } from "react";
import {
  CategoryQueryKeys,
  CategoryWitchComputedFields,
  SubCategoryWitchComputedFields,
} from "@/modules/category/types";

export function useGetCategories() {
  const { apiBase } = useAxios();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: [CategoryQueryKeys.LIST],
    gcTime: 1000 * 60 * 10,
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

  const subCategories = useMemo<
    SubCategoryWitchComputedFields[] | undefined
  >(() => {
    if (!categories) return undefined;
    const subCategoriesTmp: SubCategoryWitchComputedFields[] = [];
    categories.forEach((category) => {
      category?.subCategories?.forEach((subCategory) => {
        subCategoriesTmp.push(subCategory);
      });
    });

    return subCategoriesTmp;
  }, [categories]);

  return {
    categories: handleCategories,
    subCategories,
    isLoadingCategories,
    categoriesError,
    refetchCategories,
  };
}
