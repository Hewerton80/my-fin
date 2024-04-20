import { useRouter, useSearchParams } from "next/navigation";
import { useAxios } from "../utils/useAxios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpernseWithComputedFields } from "@/types/Expense";
import { IPaginatedDocs } from "@/lib/prismaHelpers";
import { parseJsonToSearchParams } from "@/shared/parseJsonToSearchParams";
import { z } from "zod";
import { SelectOption } from "@/components/ui/forms/selects";
import { CONSTANTS } from "@/shared/constants";

const { VALIDATION_ERROR_MESSAGES } = CONSTANTS;

const baseExpenseSchema = z.object({
  name: z.string().min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELDS),
  categoriesOptions: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  frequency: z.string().min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELDS),
});
export const createExpenseSchema = baseExpenseSchema;
type InferBaseExpenseFormSchema = z.infer<typeof baseExpenseSchema>;
type InferCreateExpenseFormSchema = z.infer<typeof createExpenseSchema>;
export type ExpenseFormValues = InferBaseExpenseFormSchema &
  InferCreateExpenseFormSchema & {
    categoriesOptions: SelectOption[];
  };

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
    expenses,
    isLoadingExpenses,
    expensesError,
    // expensesQueryParams,
    refetchExpenses,
    goToPage,
    // changeExpenseFilter,
  };
}
