export enum InsightsQueryKeys {
  LIST = "INSIGHTS_LIST",
}

export interface Insights {
  _sum?: {
    amount?: number;
  };
  _count?: number;
}
