"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import { useGetCategories } from "@/modules/category/hooks/useGetCategories";
import { useGetTransiontionsHistotyByCategory } from "@/modules/transitionHistory/hooks/useGetTransiontionsHistotyByCategory";
import { CategoryInsights } from "@/modules/category/components/CategoryInsights";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";

export default function CategoriesPage() {
  const { subCategories, isLoadingCategories, refetchCategories } =
    useGetCategories();

  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    isLoadingTransitionsHistory,
    transitionsHistory,
    transitionsHistoryError,
    refetchTransitionsHistory,
  } = useGetTransiontionsHistotyByCategory(selectedCategory);

  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      refetchTransitionsHistory();
    }
  }, [selectedCategory, refetchTransitionsHistory]);

  if (isLoadingCategories) {
    <Card.Root>
      <FeedBackLoading />
    </Card.Root>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card.Root>
        <Card.Header>
          <Card.Title>Categories</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-wrap gap-1.5">
            {subCategories?.map((category) => (
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
      <CategoryInsights
        isLoadingTransitionsHistory={isLoadingTransitionsHistory}
        transitionsHistory={transitionsHistory}
        transitionsHistoryError={transitionsHistoryError}
        refetchTransitionsHistory={refetchTransitionsHistory}
      />
    </div>
  );
}
