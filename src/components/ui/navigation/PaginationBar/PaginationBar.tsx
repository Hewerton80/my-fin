"use client";
import React, { useMemo, useCallback } from "react";
// import { getBodyElement } from "../../../../utils/getBodyElement";
import { ButtonGroup } from "../../dataDisplay/ButtonGroup";
import { getRange } from "@/shared/getRange";
import { Button } from "../../buttons/Button";

export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  disabled?: boolean;
  onChangePage: (toPage: number) => void;
}

export function PaginationBar({
  totalPages,
  currentPage,
  totalRecords,
  perPage,
  disabled,
  onChangePage,
}: PaginationBarProps) {
  const paginationLabel = useMemo(() => {
    const startRange = (currentPage - 1) * perPage + 1;
    let endRange = (currentPage - 1) * perPage + perPage;
    endRange = endRange < totalRecords ? endRange : totalRecords;
    return (
      <>
        Resultados da Busca {startRange}
        {" - "}
        {endRange} de {totalRecords}
      </>
    );
  }, [currentPage, perPage, totalRecords]);

  const arrayPagesItens = useMemo(() => {
    const maximumNumberOfButtonsToNavigate = 5;
    let initialIndexPage =
      parseInt(String(currentPage / maximumNumberOfButtonsToNavigate)) *
      maximumNumberOfButtonsToNavigate;
    initialIndexPage = initialIndexPage > 0 ? initialIndexPage - 1 : 0;

    return getRange(totalPages).slice(
      initialIndexPage,
      initialIndexPage + maximumNumberOfButtonsToNavigate
    );
  }, [currentPage, totalPages]);

  const handleChangePage = useCallback(
    (toPage: number) => {
      onChangePage(toPage);
      // const bodyElement = getBodyElement();
      // if (bodyElement && document?.documentElement) {
      //   bodyElement.scrollTop = 0;
      //   document.documentElement.scrollTop = 0;
      // }
    },
    [onChangePage]
  );

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between w-full gap-2">
      <span className="text-xs sm:text-sm">{paginationLabel}</span>
      {totalPages > 0 && (
        <ButtonGroup>
          <Button
            variantStyle="primary-ghost"
            // size="sm"
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1 || disabled}
          >
            {"<"}
          </Button>
          {arrayPagesItens.map((page, i) => (
            <Button
              key={i + "page"}
              variantStyle={
                currentPage === page + 1 ? "primary" : "primary-ghost"
              }
              // size="sm"
              disabled={disabled}
              onClick={() =>
                i + 1 !== currentPage && handleChangePage(page + 1)
              }
            >
              {page + 1}
            </Button>
          ))}
          <Button
            variantStyle="primary-ghost"
            // size="sm"
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages || disabled}
          >
            {">"}
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
}
