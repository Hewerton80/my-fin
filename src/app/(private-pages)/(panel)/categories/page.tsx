"use client";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import { IColmunDataTable } from "@/components/ui/dataDisplay/DataTable";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { CategoryTableActions } from "@/modules/category/components/CategoryTableActions";
import { useGetCategories } from "@/modules/category/hooks/useGetCategories";
import { SubCategoryWitchComputedFields } from "@/modules/category/types";
import { useGetTransiontionsHistotyByCategory } from "@/modules/transitionHistory/hooks/useGetTransiontionsHistotyByCategory";
import { format } from "date-fns/format";
import { TransitionHistoryWitchConputedFields } from "@/modules/transitionHistory/types";
import { LineChart } from "@/components/ui/charts/LineChart";

export default function CategoriesPage() {
  const { subCategories, refetchCategories } = useGetCategories();

  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    isLoadingTransitionsHistory,
    transitionsHistory,
    transitionsHistoryError,
    refetchTransitionsHistory,
  } = useGetTransiontionsHistotyByCategory(selectedCategory);

  const cols = useMemo<IColmunDataTable<SubCategoryWitchComputedFields>[]>(
    () => [
      {
        label: "Nome",
        field: "name",
        onParse: (category) => (
          <>
            {category?.iconName ? `${category?.iconName} ` : ""}
            {category?.name}
          </>
        ),
      },
      {
        label: "",
        field: "actions",
        onParse: (category) => (
          <div className="flex justify-end">
            <CategoryTableActions id={category?.id!} />
          </div>
        ),
      },
    ],
    []
  );

  const getParsedDataChart = useCallback(
    (transitionsHistoryData: TransitionHistoryWitchConputedFields[]) => {
      return (
        transitionsHistoryData?.map((transitionHistory) => ({
          date: format(new Date(transitionHistory?.paidAt!), "dd MMM"),
          description: transitionHistory?.name,
          amount: transitionHistory?.amount,
        })) || []
      );
    },
    []
  );

  const lineChartMemo = useMemo(() => {
    if (isLoadingTransitionsHistory) {
      return <FeedBackLoading />;
    }
    if (transitionsHistoryError) {
      return <FeedBackError onTryAgain={refetchTransitionsHistory} />;
    }
    if (!transitionsHistory || !transitionsHistory?.length) return null;
    return (
      <LineChart
        data={getParsedDataChart(transitionsHistory)}
        lineDaraKey="amount"
        xAxisDataKey="date"
      />
    );
  }, [
    transitionsHistory,
    isLoadingTransitionsHistory,
    transitionsHistoryError,
    refetchTransitionsHistory,
    getParsedDataChart,
  ]);

  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      refetchTransitionsHistory();
    }
  }, [selectedCategory, refetchTransitionsHistory]);

  return (
    <div className="flex flex-col gap-4">
      <Card.Root>
        <Card.Header>
          <Card.Title>Categories</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-1.5">
            {subCategories?.map((category, i) => (
              <Button
                variantStyle={
                  selectedCategory === category?.id
                    ? "primary"
                    : "primary-ghost"
                }
                key={category?.id}
                onClick={() => setSelectedCategory(category?.id!)}
                leftIcon={<>{category?.iconName}</>}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card.Root>
      {lineChartMemo && (
        <Card.Root>
          <Card.Header>
            <Card.Title>Stats</Card.Title>
          </Card.Header>
          <Card.Body>{lineChartMemo}</Card.Body>
        </Card.Root>
      )}
    </div>
  );
}
