"use client";

import { Card } from "@/components/ui/cards/Card";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { Tabs } from "@/components/ui/navigation/Tabs";
import useQueryParams from "@/hooks/useQueryParams";
import { CreditCardInsightsCards } from "@/modules/creditCard/components/CreditCardInsightsCards";
import { useGetCreditCardsInsights } from "@/modules/creditCard/hooks/useGetCreditCardsInsights";
import { TransitionHistoryTable } from "@/modules/transitionHistory/components/TransitionHistoryTable";
import { IGetTransionsHistoryParams } from "@/modules/transitionHistory/types";
import { Fragment, useEffect } from "react";

export default function CreditCardsPage() {
  const {
    creditCards,
    isLoadingCreditCardsInsights,
    creditCardsInsightsError,
    oweCreditCardInsights,
    paidCreditCardInsights,
    refetchCreditCardsInsights,
  } = useGetCreditCardsInsights();

  const { setQueryParams, queryParams } =
    useQueryParams<IGetTransionsHistoryParams>();

  useEffect(() => {
    console.log("creditCards", creditCards);
    if (Number(creditCards?.length) > 0) {
      setQueryParams({ creditCardId: creditCards?.[0]?.id as string });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditCards]);

  if (isLoadingCreditCardsInsights) {
    return (
      <Card.Root>
        <FeedBackLoading />
      </Card.Root>
    );
  }

  if (creditCardsInsightsError) {
    return (
      <Card.Root>
        <Card.Body>
          <FeedBackError onTryAgain={refetchCreditCardsInsights} />
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card.Root className="col-span-12 md:col-span-4 p-6 gap-3 text-sm">
        {creditCards?.map((creditCard, i) => {
          const showDivider = i !== creditCards.length - 1;
          return (
            <Fragment key={creditCard?.id}>
              <ul className="flex flex-col gap-3 ">
                <li className="flex justify-between">
                  <span className="font-semibold">{creditCard?.name}</span>
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: creditCard?.color as string }}
                  />
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">
                    Dia de fechamento
                  </span>
                  <span>{creditCard?.invoiceClosingDay}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">
                    Dia de vencimento
                  </span>
                  <span>{creditCard?.dueDay}</span>
                </li>
              </ul>
              {showDivider && <hr className="border-t border-border" />}
            </Fragment>
          );
        })}
      </Card.Root>
      <CreditCardInsightsCards.Owe
        className="col-span-12 md:col-span-4"
        oweCreditCardInsights={oweCreditCardInsights}
      />
      {queryParams?.creditCardId && (
        <>
          <div className="col-span-12">
            <Tabs.Root
              value={queryParams?.creditCardId}
              onValueChange={(value) =>
                setQueryParams({ creditCardId: value, currentPage: 1 })
              }
            >
              <Tabs.List>
                {creditCards?.map((creditCard) => (
                  <Tabs.Trigger
                    key={creditCard.id}
                    value={creditCard?.id as string}
                  >
                    {creditCard.name}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </div>
          <div className="col-span-12">
            <TransitionHistoryTable
              hideTypeFilter
              hideCreateButton
              hideColumns={["creditCard", "actions"]}
            />
          </div>
        </>
      )}
    </div>
  );
}
