import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const isNUE = (input: any) => {
  if (input === null) return true;
  if (input === undefined) return true;
  if (typeof input === "string" && input.trim() === "") return true;
  if (Array.isArray(input) && input.length === 0) return true;
  if (typeof input === "object" && Object.keys(input).length === 0) return true;
  return false;
};

const removePropertyNUE = <T = object>(target: T): Partial<T> => {
  if (isNUE(target)) return {};
  const targetClean = {};
  for (const key in target) {
    if (!isNUE(target[key])) {
      Object.assign(targetClean, { [key]: target[key] });
    }
  }
  return targetClean;
};

const getQueryString = (queryParams: any) => {
  const queryParamsClean = removePropertyNUE(queryParams);
  const queryParamsString = new URLSearchParams(
    queryParamsClean as any
  ).toString();
  return queryParamsString;
};

export default function useQueryParams<T extends object>() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParams = Object.fromEntries(searchParams.entries()) as T;

  const setQueryParams = useCallback(
    (newQueyParams: T) => {
      const mergedQueryParams = { ...queryParams, ...newQueyParams };
      const query = getQueryString(mergedQueryParams);
      const url = `${pathname}${query ? `?${query}` : ""}`;
      router.replace(url);
    },
    [queryParams, pathname, router]
  );

  const delQueryParams = useCallback(
    (...params: Array<keyof T>) => {
      const newQueyParams = Object.keys(queryParams)
        .filter((key) => !params.includes(key as keyof T))
        .reduce(
          (filteredQuery, key) => ({
            ...filteredQuery,
            [key]: queryParams[key as keyof T],
          }),
          {} as T
        );
      const query = getQueryString(newQueyParams);
      const url = `${pathname}${query ? `?${query}` : ""}`;
      router.replace(url);
    },
    [queryParams, pathname, router]
  );

  return { queryParams, setQueryParams, delQueryParams };
}
