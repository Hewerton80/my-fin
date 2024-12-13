import { useQuery } from "@tanstack/react-query";
import { Dashboard, DashboardQueryKeys } from "../types";
import { useAxios } from "@/hooks/useAxios";
import { useCallback, useMemo } from "react";
import { removeEmptyKeys } from "@/utils/parseJsonToSearchParams";
import useQueryParams from "@/hooks/useQueryParams";
import { useSearchParams } from "next/navigation";

interface IGetDashboardParams {
  year: string;
}
export function useGetDashboard() {
  const { apiBase } = useAxios();
  const searchParams = useSearchParams();

  const { setQueryParams } = useQueryParams<IGetDashboardParams>();

  const dashBoardQueryParams = useMemo<IGetDashboardParams>(() => {
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();
    return { year };
  }, [searchParams]);

  const {
    data: dashboard,
    error: dashboardError,
    isFetching: isLoadingDashboard,
    refetch: refetchDashboard,
  } = useQuery({
    queryFn: () =>
      apiBase
        .get<Dashboard>("/me/dashboard", {
          params: removeEmptyKeys(dashBoardQueryParams),
        })
        .then((res) => res.data),
    queryKey: [DashboardQueryKeys.LIST, removeEmptyKeys(dashBoardQueryParams)],
    enabled: true,
  });

  const changeYearQueryParams = useCallback(
    (year: string) => {
      setQueryParams({ year });
    },
    [setQueryParams]
  );

  return {
    dashboard,
    dashboardError,
    isLoadingDashboard,
    dashBoardQueryParams,
    changeYearQueryParams,
    refetchDashboard,
  };
}
