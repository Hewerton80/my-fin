import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../../hooks/useAxios";
import { CreditCardWitchComputedFields } from "@/types/CreditCard";

export function useGetCreditCards() {
  const { apiBase } = useAxios();
  const {
    data: creditCards,
    isLoading: isLoadingCreditCards,
    refetch: refetchCreditCards,
    error: creditCardsError,
  } = useQuery({
    queryKey: ["creditCards"],
    queryFn: () =>
      apiBase
        .get<CreditCardWitchComputedFields[]>("/me/credit-cards")
        .then((res) => res.data || { docs: [] }),
    enabled: false,
  });
  return {
    creditCards,
    isLoadingCreditCards,
    creditCardsError,
    refetchCreditCards,
  };
}
