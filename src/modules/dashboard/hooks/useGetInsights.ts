import { useQuery } from "@tanstack/react-query";
import { Insights, InsightsQueryKeys } from "../types";
import { apiBase } from "@/lib/axios";

export function useGetInsights() {
  const {
    data: insights,
    error: insightsError,
    isFetching: isLoadingInsights,
    refetch: refetchInsights,
  } = useQuery({
    queryFn: () =>
      apiBase.get<Insights>("/me/insights").then((res) => res.data),
    queryKey: [InsightsQueryKeys.LIST],
    enabled: true,
  });
  return {
    insights,
    insightsError,
    isLoadingInsights,
    refetchInsights,
  };
}
