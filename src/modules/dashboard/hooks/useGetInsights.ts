import { useQuery } from "@tanstack/react-query";
import { Dashboard, DashboardQueryKeys } from "../types";
import { useAxios } from "@/hooks/useAxios";

export function useGetDashboard() {
  const { apiBase } = useAxios();
  const {
    data: dashboard,
    error: dashboardError,
    isFetching: isLoadingDashboard,
    refetch: refetchDashboard,
  } = useQuery({
    queryFn: () =>
      apiBase.get<Dashboard>("/me/dashboard").then((res) => res.data),
    queryKey: [DashboardQueryKeys.LIST],
    enabled: true,
  });

  return {
    dashboard,
    dashboardError,
    isLoadingDashboard,
    refetchDashboard,
  };
}
