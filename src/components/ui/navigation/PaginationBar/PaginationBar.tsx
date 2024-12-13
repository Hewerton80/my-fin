"use client";
import React, { useMemo, useCallback } from "react";
import { getRange } from "@/utils/getRange";
import { IconButton } from "../../buttons/IconButton";
import {
  LuChevronLeft as ChevronLeft,
  LuChevronRight as ChevronRight,
} from "react-icons/lu";

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

    return getRange(0, totalPages - 1).slice(
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
        <div className="flex gap-1 text-sm">
          <IconButton
            variantStyle="dark-ghost"
            // size="sm"
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1 || disabled}
            icon={<ChevronLeft />}
          />

          {arrayPagesItens.map((page, i) => (
            <IconButton
              key={i + "page"}
              variantStyle={currentPage === page + 1 ? "outline" : "dark-ghost"}
              disabled={disabled}
              onClick={() =>
                i + 1 !== currentPage && handleChangePage(page + 1)
              }
              icon={<span className="text-sm">{page + 1}</span>}
            />
          ))}
          <IconButton
            variantStyle="dark-ghost"
            // size="sm"
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages || disabled}
            icon={<ChevronRight />}
          />
        </div>
      )}
    </div>
  );
}
