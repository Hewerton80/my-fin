"use client";
import { Card } from "@/components/ui/cards/Card";
import {
  DataTable,
  IColmunDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { CategoryTableActions } from "@/modules/category/components/CategoryTableActions";
import { useGetCategories } from "@/modules/category/hooks/useGetCategories";
import { SubCategoryWitchComputedFields } from "@/modules/category/types";
import { isUndefined } from "@/shared/isType";
import { useEffect, useMemo } from "react";

export default function CategoriesPage() {
  const {
    subCategories,
    categoriesError,
    isLoadingCategories,
    refetchCategories,
  } = useGetCategories();

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

  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);
  return (
    <>
      <Card.Root>
        <Card.Header>
          <Card.Title>Categories</Card.Title>
          {/* <Card.Actions>
        <Card.Action onClick={refetchCategories}>Atualizar</Card.Action>
      </Card.Actions> */}
        </Card.Header>
        <Card.Body>
          <DataTable
            columns={cols}
            data={subCategories}
            isLoading={isLoadingCategories || isUndefined(subCategories)}
            onTryAgainIfError={refetchCategories}
            isError={Boolean(categoriesError)}
          />
        </Card.Body>
      </Card.Root>
    </>
  );
}
