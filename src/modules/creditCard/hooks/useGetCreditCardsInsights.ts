import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../../hooks/useAxios";
import {
  CreditCardQueryKeys,
  CreditCardWitchComputedFields,
} from "@/modules/creditCard/types";
import { CreditCardInsights } from "@/modules/dashboard/types";

export function useGetCreditCardsInsights() {
  const { apiBase } = useAxios();

  const {
    data,
    isLoading: isLoadingCreditCardsInsights,
    refetch: refetchCreditCardsInsights,
    error: creditCardsInsightsError,
  } = useQuery({
    queryKey: [CreditCardQueryKeys.INSIGHTS],
    queryFn: () =>
      apiBase
        .get<{
          creditCards: CreditCardWitchComputedFields[];
          paidCreditCardInsights: CreditCardInsights[];
          oweCreditCardInsights: CreditCardInsights[];
        }>("/me/credit-cards/insights")
        .then((res) => res.data || { creditCards: { docs: [] } }),
    enabled: true,
  });

  return {
    creditCards: data?.creditCards,
    paidCreditCardInsights: data?.paidCreditCardInsights,
    oweCreditCardInsights: data?.oweCreditCardInsights,
    isLoadingCreditCardsInsights,
    creditCardsInsightsError,
    refetchCreditCardsInsights,
  };
}
