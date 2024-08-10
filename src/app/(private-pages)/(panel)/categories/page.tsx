"use client";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import { useGetTransiontionsHistotyByCategory } from "@/modules/transitionHistory/hooks/useGetTransiontionsHistotyByCategory";
import { CategoryInsights } from "@/modules/category/components/CategoryInsights";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { useGetCategories } from "@/modules/category/hooks/useGetCategories";

export default function CategoriesPage() {
  const { categories, isLoadingCategories } = useGetCategories();

  const {
    isLoadingTransitionsHistory,
    transitionsHistory,
    transitionsHistoryError,
    transionHistoriesQueryParams,
    fetchTransitionsHistory,
  } = useGetTransiontionsHistotyByCategory();

  if (isLoadingCategories) {
    return (
      <Card.Root>
        <FeedBackLoading />
      </Card.Root>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card.Root>
        <Card.Header>
          <Card.Title>Categories</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-1.5">
            {categories?.map((category) => (
              <Button
                variantStyle={
                  transionHistoriesQueryParams?.categoryId === category?.id
                    ? "primary"
                    : "primary-ghost"
                }
                key={category?.id}
                onClick={() => fetchTransitionsHistory(category?.id!)}
                leftIcon={<>{category?.iconName}</>}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card.Root>
      <CategoryInsights
        isLoadingTransitionsHistory={isLoadingTransitionsHistory}
        transitionsHistory={transitionsHistory}
        transitionsHistoryError={transitionsHistoryError}
        refetchTransitionsHistory={fetchTransitionsHistory}
      />
    </div>
  );
}
