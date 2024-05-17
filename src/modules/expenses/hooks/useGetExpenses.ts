import { useRouter, useSearchParams } from "next/navigation";
import { useAxios } from "../../../hooks/useAxios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpernseWithComputedFields } from "@/types/Expense";
import { IPaginatedDocs } from "@/lib/prismaHelpers";
import { parseJsonToSearchParams } from "@/shared/parseJsonToSearchParams";

export function useGetExpenses() {
  const { apiBase } = useAxios();
  const router = useRouter();

  const searchParams = useSearchParams();

  // const getInitialQueryParamsFromUrl =
  //   useCallback((): IGetStudentsQueryParams => {
  //     return {
  //       role: searchParams.get("role") || "",
  //       gender: searchParams.get("gender") || "",
  //       isActive: searchParams.get("isActive") || "",
  //       keyword: searchParams.get("keyword") || "",
  //       orderBy: searchParams.get("orderBy") || orderByExpenseOptions[0].value,
  //       currentPage: Number(searchParams.get("currentPage")) || 1,
  //       perPage: Number(searchParams.get("perPage")) || 10,
  //     };
  //   }, [searchParams]);

  // const [expensesQueryParams, setStudentsQueryParams] =
  //   useState<IGetStudentsQueryParams>(getInitialQueryParamsFromUrl());
  const [expensesQueryParams, setStudentsQueryParams] = useState({});

  // const [expensesQueryParamsDebounced, setStudentsQueryParamsDebounced] =
  //   useState<IGetStudentsQueryParams>(getInitialQueryParamsFromUrl());

  const [expensesQueryParamsDebounced, setStudentsQueryParamsDebounced] =
    useState({});
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: expenses,
    error: expensesError,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () =>
      apiBase
        .get<IPaginatedDocs<ExpernseWithComputedFields>>("/expenses")
        //   .get<IPaginatedDocs<ExpenseWithComputedFields>>("/expenses", {
        //      params: removeEmptyKeys(expensesQueryParamsDebounced),
        //   })
        .then((res) => res.data || { docs: [] })
        .finally(() => setIsSearching(false)),
    queryKey: ["expenses"],
    enabled: false,
    retry: 1,
  });

  const parsedExpenses = useMemo<
    IPaginatedDocs<ExpernseWithComputedFields> | undefined
  >(() => {
    if (!expenses) return undefined;
    const parsedExpenses: IPaginatedDocs<ExpernseWithComputedFields> = {
      ...expenses,
    };
    parsedExpenses.docs = [...parsedExpenses.docs].map((expense) => {
      const subCategoriesIcons = expense?.subCategories
        ?.map((subCategory) => subCategory.iconName)
        ?.join("");
      const handledNane = subCategoriesIcons
        ? `${subCategoriesIcons} ${expense.name}`
        : expense.name;
      return {
        ...expense,
        name: handledNane,
      };
    });
    return parsedExpenses;
  }, [expenses]);

  const isLoadingExpenses = useMemo(
    () => isFetching || isSearching,
    [isFetching, isSearching]
  );

  useEffect(() => {
    refetch();
  }, [expensesQueryParamsDebounced, refetch]);

  //   const refetchExpensesDebounced = useDebouncedCallback(
  //     (queryParams?: IGetStudentsQueryParams) => {
  //       const queryParamsTmp = queryParams
  //         ? { ...queryParams, currentPage: 1 }
  //         : { ...expensesQueryParams };

  //       setStudentsQueryParamsDebounced(queryParamsTmp);
  //       router.push(parseJsonToSearchParams(queryParamsTmp));
  //     },
  //     500
  //   );

  //   const changeExpenseFilter = useCallback(
  //     (newStudentsQueryParams: IGetStudentsQueryParams) => {
  //       setIsSearching(true);
  //       setStudentsQueryParams((prev) => {
  //         const newStudentsQueryParamsTmp = {
  //           ...prev,
  //           ...newStudentsQueryParams,
  //         };
  //         refetchExpensesDebounced(newStudentsQueryParamsTmp);
  //         return newStudentsQueryParamsTmp;
  //       });
  //     },
  //     [refetchExpensesDebounced]
  //   );

  const refetchExpenses = useCallback(() => {
    setStudentsQueryParamsDebounced({ ...expensesQueryParams });
  }, [expensesQueryParams]);

  const goToPage = useCallback(
    (page: number) => {
      const newQueryParams = { ...expensesQueryParams, currentPage: page };
      setStudentsQueryParamsDebounced(newQueryParams);
      setStudentsQueryParams(newQueryParams);
      router.push(parseJsonToSearchParams(newQueryParams));
    },
    [expensesQueryParams, router]
  );

  return {
    expenses: parsedExpenses,
    isLoadingExpenses,
    expensesError,
    // expensesQueryParams,
    refetchExpenses,
    goToPage,
    // changeExpenseFilter,
  };
}
