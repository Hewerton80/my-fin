import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  },
});

export enum QUERY_KEYS {
  Todo = "Todo",
}
