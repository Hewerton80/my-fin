import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { useMemo } from "react";
import {
  CategoryQueryKeys,
  GroupCategoryWitchComputedFields,
  CategoryWitchComputedFields,
} from "@/modules/category/types";

export function useGetGroupCategories() {
  const { apiBase } = useAxios();
  const {
    data: groupCategories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: [CategoryQueryKeys.LIST],
    gcTime: 1000 * 60 * 10,
    queryFn: () =>
      apiBase
        .get<GroupCategoryWitchComputedFields[]>("/group-categories")
        .then((res) => res.data || []),
    enabled: false,
  });

  const handleCategories = useMemo<
    GroupCategoryWitchComputedFields[] | undefined
  >(() => {
    if (!groupCategories) return undefined;
    return [...groupCategories].map((groupCategory) => {
      return {
        ...groupCategory,
        categories:
          [...(groupCategory?.categories || [])]?.map((subCategory) => {
            return {
              ...subCategory,
              name: subCategory.iconName
                ? `${subCategory.iconName} ${subCategory.name}`
                : subCategory.name,
            };
          }) || [],
      };
    });
  }, [groupCategories]);

  const categories = useMemo<CategoryWitchComputedFields[] | undefined>(() => {
    if (!groupCategories) return undefined;
    const categoriesTmp: CategoryWitchComputedFields[] = [];
    groupCategories.forEach((category) => {
      category?.categories?.forEach((subCategory) => {
        categoriesTmp.push(subCategory);
      });
    });

    return categoriesTmp;
  }, [groupCategories]);

  return {
    groupCategories: handleCategories,
    categories,
    isLoadingCategories,
    categoriesError,
    refetchCategories,
  };
}
